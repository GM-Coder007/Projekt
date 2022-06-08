package com.example.gymfinder

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.example.gymfinder.databinding.ActivityRegistracijaBinding
import timber.log.Timber
import androidx.core.app.NotificationCompat
import androidx.core.content.ContextCompat
import androidx.core.content.ContextCompat.getSystemService



class RegistracijaActivity : AppCompatActivity() {
    //val sharedPref = getSharedPreferences(MY_SP_FILE_TITLE, Context.MODE_PRIVATE)
    private lateinit var binding: ActivityRegistracijaBinding

    lateinit var app: MyApplication


    override fun onCreate(savedInstanceState: Bundle?) {

        app = application as MyApplication
        super.onCreate(savedInstanceState)

        binding = ActivityRegistracijaBinding.inflate(layoutInflater)
        setContentView(binding.root)


        if (BuildConfig.DEBUG) {
            Timber.plant(Timber.DebugTree()) //Init report type
        }

        binding = ActivityRegistracijaBinding.inflate(layoutInflater)
        setContentView(binding.root)

    }


    fun ZapustiRegistracijo(view: android.view.View) {
        finish();
    }


    private fun createNotificationChannel() {

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val name = "MyTestChannel"
            val descriptionText = "Testing notifications"
            val importance = NotificationManager.IMPORTANCE_DEFAULT
            val channel = NotificationChannel(MainActivity.CHANNEL_ID, name, importance).apply {
                description = descriptionText
            }

            val notificationManager: NotificationManager =
                getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
    }


    fun createNotify(title: String, content: String, imageId: Int) {
        val myTimeIntent = Intent(this, MyNotificationReceiver::class.java).apply {
            action = MainActivity.MY_ACTION_FILTER
            putExtra(MainActivity.TIME_ID, "TODO SOME VAR")
        }
        Timber.d("createNotifyWithIntent")
        val myPendingIntent: PendingIntent =
            PendingIntent.getBroadcast(
                this,
                MainActivity.getNotificationUniqueID(),
                myTimeIntent,
                PendingIntent.FLAG_UPDATE_CURRENT
            )


        var builder = NotificationCompat.Builder(this, MainActivity.CHANNEL_ID)
            .setSmallIcon(imageId)
            .setContentTitle(title)
            .setContentText(content)
            .setContentIntent(myPendingIntent)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
        val notificationManager: NotificationManager =
            getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.notify(MainActivity.getNotificationUniqueID(), builder.build())
    }

    fun DodajUporabnika(view: android.view.View) {
        var test: String = "DA"
        binding.etEmail.text.ifEmpty {
            binding.etEmail.setError("Napaka! Email mora biti vnesen!");
            test = "NE"
        }
        binding.etGeslo.text.ifEmpty {
            binding.etGeslo.setError("Napaka! Geslo mora biti vneseno!")
            test = "NE"
        }
        binding.etPonoviGeslo.text.ifEmpty {
            binding.etPonoviGeslo.setError("Napaka! Ponovno geslo mora biti vneseno!")
            test = "NE"
        }

        if(binding.etGeslo.text.toString() != binding.etPonoviGeslo.text.toString())
        {
            test = "NE"
            this.createNotify("Napaka:","Geslo se ne ujema!", R.drawable.ic_action_alarm)
        }

        if(test=="DA") {
            val data = Intent()
            data.putExtra("Email", binding.etEmail.text.toString())
            data.putExtra("Password", binding.etGeslo.text.toString())

            setResult(RESULT_OK, data)
            finish()
            this.createNotify("Pregled cest:","Uspešno ste vstavili novega uporabnika!", R.drawable.ic_action_yes)
        }
    }

    fun OpenPrijava2(view: android.view.View) {
        finish()
        val intent = Intent(this, PrijavaActivity::class.java)
        startActivity(intent)
    }


}