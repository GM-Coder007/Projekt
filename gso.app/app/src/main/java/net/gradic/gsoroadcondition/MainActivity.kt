package net.gradic.gsoroadcondition

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import com.google.android.gms.location.LocationRequest
import net.gradic.gsoroadcondition.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    private lateinit var sensorManager: SensorManager
    private lateinit var accelerationListener: SensorEventListener

    private var activityResultLauncher: ActivityResultLauncher<Array<String>>
    init {
        this.activityResultLauncher = registerForActivityResult(
            ActivityResultContracts.RequestMultiplePermissions()
        ) { result ->
            var allAreGranted = true
            for (b in result.values)  allAreGranted = allAreGranted && b

            if (allAreGranted) {

            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        //setContentView(R.layout.activity_main)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        sensorManager = getSystemService(Context.SENSOR_SERVICE) as SensorManager
        val sensor: Sensor? = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)

        accelerationListener = object : SensorEventListener {
            override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {
                // Not in use
            }

            override fun onSensorChanged(event: SensorEvent) {
                val gravity = FloatArray(3)
                val linear_acceleration = FloatArray(3)
                val alpha: Float = 0.8f

                // Isolate the force of gravity with the low-pass filter.
                gravity[0] = alpha * gravity[0] + (1 - alpha) * event.values[0]
                gravity[1] = alpha * gravity[1] + (1 - alpha) * event.values[1]
                gravity[2] = alpha * gravity[2] + (1 - alpha) * event.values[2]

                // Remove the gravity contribution with the high-pass filter.
                linear_acceleration[0] = event.values[0] - gravity[0]
                linear_acceleration[1] = event.values[1] - gravity[1]
                linear_acceleration[2] = event.values[2] - gravity[2]

                binding.textView1.setText(linear_acceleration[0].toString())
                binding.textView2.setText(linear_acceleration[1].toString())
                binding.textView3.setText(linear_acceleration[2].toString())
            }
        }
        sensorManager.registerListener(accelerationListener, sensor, SensorManager.SENSOR_DELAY_NORMAL);

        var locationRequest = LocationRequest.create()
            .apply {
                interval = 1000 //can be much higher
                fastestInterval = 500
                smallestDisplacement = 10f //10m
                priority = LocationRequest.PRIORITY_HIGH_ACCURACY
                maxWaitTime = 1000
            }
    }

    override fun onPause() {
        super.onPause()
        sensorManager.unregisterListener(accelerationListener)
    }
}