package com.example.gymfinder

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.gymfinder.databinding.ActivityPrijavaBinding
import timber.log.Timber



class PrijavaActivity : AppCompatActivity() {
    //val sharedPref = getSharedPreferences(MY_SP_FILE_TITLE, Context.MODE_PRIVATE)
    private lateinit var binding: ActivityPrijavaBinding

    lateinit var app: MyApplication


    override fun onCreate(savedInstanceState: Bundle?) {

        app = application as MyApplication
        super.onCreate(savedInstanceState)

        binding = ActivityPrijavaBinding.inflate(layoutInflater)
        setContentView(binding.root)


        if (BuildConfig.DEBUG) {
            Timber.plant(Timber.DebugTree()) //Init report type
        }

        binding = ActivityPrijavaBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // get reference to all views
        var et_email = findViewById(R.id.etEmailPrijava) as EditText
        var et_password = findViewById(R.id.etGesloPrijava) as EditText
        var btn_reset = findViewById(R.id.btnResetirajVnos) as Button
        var btn_submit = findViewById(R.id.btnPrijava) as Button


        btn_reset.setOnClickListener {
            // resetiramo vrednosti vnosnih polj
            et_email.setText("")
            et_password.setText("")
        }

        // poslušalec
        btn_submit.setOnClickListener {
            val user_name = et_email.text;
            val password = et_password.text;
            Toast.makeText(this@PrijavaActivity, user_name, Toast.LENGTH_LONG).show()

            ////////////////////////////////////////////////////////////////////////////////////

            // KODA ZA VALIDACIJO EMAIL IN GESLA


        }

    }


    fun ZapustiPrijavo(view: android.view.View) {
        finish();
    }

    fun OpenRegistracija2(view: android.view.View) {
        finish()
        val intent = Intent(this, RegistracijaActivity::class.java)
        startActivity(intent)
    }


}