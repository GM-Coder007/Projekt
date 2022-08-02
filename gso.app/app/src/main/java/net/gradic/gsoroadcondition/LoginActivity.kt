package net.gradic.gsoroadcondition

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Toast
import com.github.kittinunf.fuel.httpPost
import com.google.gson.Gson
import net.gradic.gsoroadcondition.databinding.ActivityLoginBinding

class LoginActivity : AppCompatActivity() {
    private lateinit var binding: ActivityLoginBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        //setContentView(R.layout.activity_login)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)
    }

    fun postData(email: String, password: String) {
        val url = getString(R.string.serverURL) + "/users/login"

        val gson = Gson()
        val jsonString = gson.toJson(RegisterActivity.RegisterModel(email, password))

        url.httpPost().header(mapOf("Content-Type" to "application/json")).body(jsonString).responseString { request, response, result ->
            if (response.statusCode == 200) {
                Toast.makeText(this, "Successfully logged with $email", Toast.LENGTH_SHORT).show()
                finish()
            }
            else Toast.makeText(this, "Failed to login", Toast.LENGTH_SHORT).show()
        }
    }

    fun login(view: android.view.View) {
        val email = binding.etEmailPrijava.text.toString()
        val password = binding.editPassword.text.toString()
        postData(email, password)
    }

    /*fun back(view: android.view.View) {
        finish();
    }*/
}