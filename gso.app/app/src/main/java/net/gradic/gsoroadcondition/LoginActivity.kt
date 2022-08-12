package net.gradic.gsoroadcondition

import android.content.ActivityNotFoundException
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.provider.MediaStore
import android.widget.Toast
import com.github.kittinunf.fuel.core.ResponseDeserializable
import com.github.kittinunf.fuel.gson.responseObject
import com.github.kittinunf.fuel.httpPost
import com.google.gson.Gson
import net.gradic.gsoroadcondition.databinding.ActivityLoginBinding

class LoginActivity : AppCompatActivity() {
    private lateinit var binding: ActivityLoginBinding
    val REQUEST_IMAGE_CAPTURE = 1

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        //setContentView(R.layout.activity_login)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)
    }

    data class LoginModel(
        val email: String,
        val password: String
    )

    fun postData(email: String, password: String) {
        val url = getString(R.string.serverURL) + "/users/login"

        val gson = Gson()
        val jsonString = gson.toJson(LoginModel(email, password))

        data class Token(var token: String, var twofa: Boolean)

        /*url.httpPost().header(mapOf("Content-Type" to "application/json")).body(jsonString).responseString { request, response, result ->
            if (response.statusCode == 200) {
                Toast.makeText(this, "Successfully logged with $email", Toast.LENGTH_SHORT).show()
                finish()
            }
            else Toast.makeText(this, "Failed to login", Toast.LENGTH_SHORT).show()
        }*/

        url.httpPost().header(mapOf("Content-Type" to "application/json")).body(jsonString).responseObject<Token> { request, response, result ->
            if (response.statusCode == 200 ) {
                var token = result.component1()?.token ?: "";
                val twofa = result.component1()?.twofa ?: false
                if (twofa) {
                    val takePictureIntent = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
                    try {
                        startActivityForResult(takePictureIntent, REQUEST_IMAGE_CAPTURE)
                    } catch (e: ActivityNotFoundException) {
                        Toast.makeText(this, "Can't open a camera app", Toast.LENGTH_SHORT).show()
                    }

                }

                Toast.makeText(this, "Successfully logged with $email", Toast.LENGTH_SHORT).show()
                val sharedPref = getSharedPreferences("JWT", Context.MODE_PRIVATE)
                with (sharedPref.edit()) {
                    putString("JWT", token)
                    apply()
                }
                finish()
            }
            else Toast.makeText(this, "Failed to login - ${response.statusCode}", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == REQUEST_IMAGE_CAPTURE && resultCode == RESULT_OK) {
            val imageBitmap = data?.extras?.get("data") as Bitmap
            //imageView.setImageBitmap(imageBitmap)
        }
    }


    fun login(view: android.view.View) {
        val email = binding.etEmailPrijava.text.toString()
        val password = binding.etGesloPrijava.text.toString()
        postData(email, password)
    }

    /*fun back(view: android.view.View) {
        finish();
    }*/
}