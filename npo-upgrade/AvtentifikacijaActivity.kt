package com.example.gymfinder

import android.app.Activity
import android.content.ActivityNotFoundException
import android.content.Intent
import android.graphics.Bitmap
import android.os.Bundle
import android.provider.MediaStore
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import com.example.gymfinder.databinding.ActivityAvtentifikacijaBinding
import timber.log.Timber



class AvtentifikacijaActivity : AppCompatActivity() {
    //val sharedPref = getSharedPreferences(MY_SP_FILE_TITLE, Context.MODE_PRIVATE)
    private lateinit var binding: ActivityAvtentifikacijaBinding

    lateinit var app: MyApplication

    override fun onCreate(savedInstanceState: Bundle?) {

        app = application as MyApplication
        super.onCreate(savedInstanceState)

        binding = ActivityAvtentifikacijaBinding.inflate(layoutInflater)
        setContentView(binding.root)

/*
        setContentView(R.layout.activity_prikaz)
        val tv1: TextView = findViewById(R.id.txtUporabnik)
        tv1.text = "Hello"
*/


        if (BuildConfig.DEBUG) {
            Timber.plant(Timber.DebugTree()) //Init report type
        }

        binding = ActivityAvtentifikacijaBinding.inflate(layoutInflater)
        setContentView(binding.root)


    }

    fun ZapustiAvtentifikacijo(view: android.view.View) {

        val builder = AlertDialog.Builder(this)
        builder.setTitle("Prekliči avtentifikacijo")
        builder.setMessage("Ali želite zapustiti avtentifikacijo?")
        builder.setPositiveButton("Da") { dialog, which -> // Do something when user press the positive button
            finish(); }
        builder.setNeutralButton("Prekliči") { dialog, which ->  Toast.makeText(applicationContext,"Preklicali ste dialog.",Toast.LENGTH_SHORT).show() }

        builder.setNegativeButton("Ne"){dialog,which -> Toast.makeText(applicationContext,"Kliknili ste NE.",Toast.LENGTH_SHORT).show() }
        val dialog: AlertDialog = builder.create()
        dialog.show()

        //finish();
    }
    val REQUEST_IMAGE_CAPTURE = 1

    // FUNKCIJA ZA ZAJEMANJE SLIKE IZ MOBILNE NAPRAVE
    fun Avtentifikacija(view: android.view.View)
    {
        val takePictureIntent = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
        try {
            startActivityForResult(takePictureIntent, REQUEST_IMAGE_CAPTURE)

        } catch (e: ActivityNotFoundException) {

        }
    }

    // FUNKCIJA ZA SHRANJEVANJE SLIKE PO ZAJETJU IN PRIKAZ V KOMPONENTI IMAGEVIEW
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (resultCode == Activity.RESULT_OK
            && requestCode == REQUEST_IMAGE_CAPTURE) {
            val imageBitmap = data?.extras?.get("data") as Bitmap
            binding.imgZajeta.setImageBitmap(imageBitmap)
            // V TEJ FUNKCIJI JE SEDAJ POTREBNO SLIKO POSLATI STREŽNIKU DA JO PRIMERJA S SLIKAMI BAZE
        }
    }



}









