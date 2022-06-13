package com.example.gymfinder

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import com.example.gymfinder.databinding.ActivityPrikazBinding
import timber.log.Timber



class PrikazActivity : AppCompatActivity() {
    //val sharedPref = getSharedPreferences(MY_SP_FILE_TITLE, Context.MODE_PRIVATE)
    private lateinit var binding: ActivityPrikazBinding

    lateinit var app: MyApplication

    override fun onCreate(savedInstanceState: Bundle?) {

        app = application as MyApplication
        super.onCreate(savedInstanceState)

        binding = ActivityPrikazBinding.inflate(layoutInflater)
        setContentView(binding.root)

/*
        setContentView(R.layout.activity_prikaz)
        val tv1: TextView = findViewById(R.id.txtUporabnik)
        tv1.text = "Hello"
*/


        if (BuildConfig.DEBUG) {
            Timber.plant(Timber.DebugTree()) //Init report type
        }

        binding = ActivityPrikazBinding.inflate(layoutInflater)
        setContentView(binding.root)

/*
        val textView: TextView
        textView = findViewById(R.id.txtStVoznje);
        textView.setText("Hello World");
*/
        /////////////////////////////////////////////////////////////
        // ZAMENJAMO S PODATKI IZ PODATKOVNE BAZE
        binding.txtUporabnik.text = "test";
        binding.txtStVoznje.setText("test")
        binding.txtDatumVoznje.setText("test");
        }

        fun ZapustiPrikaz(view: android.view.View) {
            /*
            val dialog = AlertDialog.Builder(this)
            dialog.setTitle("Kotlin Dialog")
            dialog.setMessage("This is a Kotlin dialog.")
            dialog.setPositiveButton("OK", null)
            dialog.show()
            */

            val builder = AlertDialog.Builder(this)
            builder.setTitle("Končaj vožnjo")
            builder.setMessage("Ali želite končati vožnjo ?")
            builder.setPositiveButton("Da") { dialog, which -> // Do something when user press the positive button
                finish(); }
            builder.setNeutralButton("Prekliči") { dialog, which ->  Toast.makeText(applicationContext,"Preklicali ste dialog.",Toast.LENGTH_SHORT).show() }

            builder.setNegativeButton("Ne"){dialog,which -> Toast.makeText(applicationContext,"Kliknili ste NE.",Toast.LENGTH_SHORT).show() }
            val dialog: AlertDialog = builder.create()
            dialog.show()

            //finish();
         }

}









