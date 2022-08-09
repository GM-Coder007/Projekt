package net.gradic.gsoroadcondition

import android.Manifest
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.content.pm.PackageManager
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.location.Location
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Toast
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.app.ActivityCompat
import com.github.kittinunf.fuel.gson.responseObject
import com.github.kittinunf.fuel.httpPost
import com.google.android.gms.location.*
import com.google.gson.Gson
import net.gradic.gsoroadcondition.databinding.ActivityMainBinding
import java.time.Instant
import java.time.format.DateTimeFormatter
import java.util.*

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    private lateinit var sensorManager: SensorManager
    private lateinit var accelerationListener: SensorEventListener
    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private var locationRequest: LocationRequest
    private var locationCallback: LocationCallback
    private var activityResultLauncher: ActivityResultLauncher<Array<String>>
    private lateinit var sharedPref: SharedPreferences;

    private var driving = false;
    private var driveId = ""

    private var lastLocation: Location? = null

    private var shocks = arrayOf<Float>( 0.0f, 0.0f, 0.0f )

    private var jwt = ""

    init {
        locationRequest = LocationRequest.create()
            .apply { //https://stackoverflow.com/questions/66489605/is-constructor-locationrequest-deprecated-in-google-maps-v2
                interval = 1000 //can be much higher
                fastestInterval = 500
                smallestDisplacement = 1f //10m
                priority = Priority.PRIORITY_HIGH_ACCURACY
                maxWaitTime = 1000
            }
        locationCallback = object : LocationCallback() {
            override fun onLocationResult(locationResult: LocationResult) {
                val location = locationResult.locations[0]
                //updateLocation(location)
                binding.textView1.setText("Location: ${location.latitude}, ${location.longitude}")

                if (lastLocation != null) {
                    postData(location)
                    shocks[0] = 0.0f
                    shocks[1] = 0.0f
                    shocks[2] = 0.0f
                }

                lastLocation = location
            }
        }

        accelerationListener = object : SensorEventListener {
            override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {
                // Not in use
            }

            override fun onSensorChanged(event: SensorEvent) {
                val gravity = FloatArray(3)
                val linearAcceleration = FloatArray(3)
                val alpha: Float = 0.8f

                // Isolate the force of gravity with the low-pass filter.
                gravity[0] = alpha * gravity[0] + (1 - alpha) * event.values[0]
                gravity[1] = alpha * gravity[1] + (1 - alpha) * event.values[1]
                gravity[2] = alpha * gravity[2] + (1 - alpha) * event.values[2]

                // Remove the gravity contribution with the high-pass filter.
                linearAcceleration[0] = event.values[0] - gravity[0]
                linearAcceleration[1] = event.values[1] - gravity[1]
                linearAcceleration[2] = event.values[2] - gravity[2]

                //binding.textView1.setText(linear_acceleration[0].toString())
                //binding.textView2.setText(linear_acceleration[1].toString())
                //binding.textView3.setText(linear_acceleration[2].toString())

                if (shocks[0] < linearAcceleration[0]) shocks[0] = linearAcceleration[0]
                if (shocks[1] < linearAcceleration[1]) shocks[1] = linearAcceleration[1]
                if (shocks[2] < linearAcceleration[2]) shocks[2] = linearAcceleration[2]
            }
        }

        this.activityResultLauncher = registerForActivityResult(
            ActivityResultContracts.RequestMultiplePermissions()
        ) { result ->
            var allAreGranted = true
            for (permission in result.values) {
                allAreGranted = allAreGranted && permission
            }

            /*if (allAreGranted) {

            }*/
        }
    }

    fun postDrive() {
        if (checkLogin()) {
            val url = getString(R.string.serverURL) + "/drives"

            data class Drive(var _id: String)

            url.httpPost().header(mapOf("Content-Type" to "application/json", "Authorization" to "Bearer $jwt")).responseObject<Drive> { request, response, result ->
                if (response.statusCode == 201) {
                    driveId = result.component1()?._id ?: ""
                }
                else if (response.statusCode == 401) {
                    logout()
                    Toast.makeText(this, "Login expired - ${response.statusCode}", Toast.LENGTH_SHORT).show()
                }
                else {
                    Toast.makeText(this, "Couldn't start drive - ${response.statusCode}", Toast.LENGTH_SHORT).show()
                }
            }
        }
        else {
            Toast.makeText(this, "You must be logged in to start a drive", Toast.LENGTH_SHORT).show()
        }
    }

    fun postData(location: Location) {
        if (checkLogin() && driveId != "") {

            data class Point(var type: String, var coordinates: Array<Double>)
            data class RoadQuality(var start: Point, var end: Point, var measurements: Array<Float>, var drive: String)

            val url = getString(R.string.serverURL) + "/rawRoadQuality"

            val gson = Gson()
            val jsonString = gson.toJson(RoadQuality(Point("Point", arrayOf(lastLocation!!.latitude, lastLocation!!.longitude)), Point("Point", arrayOf(location.latitude, location.longitude)), shocks, driveId))

            url.httpPost().header(mapOf("Content-Type" to "application/json", "Authorization" to "Bearer $jwt")).body(jsonString)
                .responseString { request, response, result ->
                    if (response.statusCode == 201) {
                        binding.textView2.text = DateTimeFormatter.ISO_INSTANT.format(Instant.now())
                    } else {
                        Toast.makeText(this, "Failed to submit data - ${response.statusCode}", Toast.LENGTH_SHORT).show()
                    }
                }
        }
    }

    private fun startLocationUpdates() {
        postDrive()
        driving = true
        binding.buttonDrive.text = getString(R.string.stopButton)
        if (ActivityCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_COARSE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            // TODO: Consider calling
            //    ActivityCompat#requestPermissions
            // here to request the missing permissions, and then overriding
            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
            //                                          int[] grantResults)
            // to handle the case where the user grants the permission. See the documentation
            // for ActivityCompat#requestPermissions for more details.
            return
        }
        fusedLocationClient.requestLocationUpdates(
            locationRequest,
            locationCallback,
            null /* Looper */
        )

        val sensor: Sensor? = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
        sensorManager.registerListener(accelerationListener, sensor, SensorManager.SENSOR_DELAY_NORMAL);
    }

    private fun stopLocationUpdates() {
        driving = false
        binding.buttonDrive.text = getString(R.string.startButton)
        fusedLocationClient.removeLocationUpdates(locationCallback)
        sensorManager.unregisterListener(accelerationListener)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        //setContentView(R.layout.activity_main)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        sharedPref = getSharedPreferences("JWT", Context.MODE_PRIVATE)
        checkLogin()

        val appPerms = arrayOf(
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_NETWORK_STATE,
            Manifest.permission.INTERNET
        )
        activityResultLauncher.launch(appPerms)

        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)

        sensorManager = getSystemService(Context.SENSOR_SERVICE) as SensorManager
        //startLocationUpdates()
    }

    override fun onResume() {
        super.onResume()
        checkLogin()
        //startLocationUpdates()
    }

    override fun onPause() {
        super.onPause()
        //stopLocationUpdates()
    }

    fun checkLogin(): Boolean {
        val jwtPref = sharedPref.getString("JWT", "")

        return if (jwtPref == "") {
            binding.textView4.text = "Not logged in"
            jwt = ""
            binding.buttonLogout.isEnabled = false
            false
        } else {
            binding.textView4.text = jwtPref
            jwt = jwtPref!!
            binding.buttonLogout.isEnabled = true
            true
        }
    }

    fun openRegisterActivity(view: android.view.View) {
        val intent = Intent(this, RegisterActivity::class.java)
        startActivity(intent)
    }

    fun openLoginActivity(view: android.view.View) {
        val intent = Intent(this, LoginActivity::class.java)
        startActivity(intent)
    }

    fun logout() {
        with (sharedPref.edit()) {
            putString("JWT", "")
            apply()
        }
        checkLogin()
    }

    fun logoutClick(view: android.view.View) {
        logout()
    }

    fun drive(view: android.view.View) {
        if (driving) {
            stopLocationUpdates()
        } else if (checkLogin()) {
            startLocationUpdates()
        }
    }
}