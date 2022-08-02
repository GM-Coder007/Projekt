package net.gradic.gsoroadcondition

import android.Manifest
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.app.ActivityCompat
import com.google.android.gms.location.*
import net.gradic.gsoroadcondition.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    private lateinit var sensorManager: SensorManager
    private lateinit var accelerationListener: SensorEventListener
    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private var locationRequest: LocationRequest
    private var locationCallback: LocationCallback
    private var activityResultLauncher: ActivityResultLauncher<Array<String>>

    init {
        locationRequest = LocationRequest.create()
            .apply { //https://stackoverflow.com/questions/66489605/is-constructor-locationrequest-deprecated-in-google-maps-v2
                interval = 1000 //can be much higher
                fastestInterval = 500
                smallestDisplacement = 10f //10m
                priority = LocationRequest.PRIORITY_HIGH_ACCURACY
                maxWaitTime = 1000
            }
        locationCallback = object : LocationCallback() {
            override fun onLocationResult(locationResult: LocationResult) {
                for (location in locationResult.locations) {
                    //updateLocation(location)
                    binding.textView1.setText(location.latitude.toString())
                    binding.textView2.setText(location.longitude.toString())
                    binding.textView3.setText(location.altitude.toString())
                }
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

    private fun startLocationUpdates() {
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
        fusedLocationClient.removeLocationUpdates(locationCallback)
        sensorManager.unregisterListener(accelerationListener)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        //setContentView(R.layout.activity_main)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

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
        startLocationUpdates()
    }

    override fun onPause() {
        super.onPause()
        stopLocationUpdates()
    }

    fun openRegisterActivity(view: android.view.View) {
        val intent = Intent(this, RegisterActivity::class.java)
        startActivity(intent)
    }
}