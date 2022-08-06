package net.gradic.gsoroadcondition

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Toast
import com.github.kittinunf.fuel.httpPost
import com.google.gson.Gson
import net.gradic.gsoroadcondition.databinding.ActivityRegisterBinding

class RegisterActivity : AppCompatActivity() {
    private lateinit var binding: ActivityRegisterBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        //setContentView(R.layout.activity_register)
        binding = ActivityRegisterBinding.inflate(layoutInflater)
        setContentView(binding.root)
    }

    data class RegisterModel(
        val email: String,
        val password: String
    )

    fun postData(email: String, password: String) {
        val url = getString(R.string.serverURL) + "/users/register"

        val gson = Gson()
        val jsonString = gson.toJson(RegisterModel(email,password))

        url.httpPost().header(mapOf("Content-Type" to "application/json")).body(jsonString).responseString { request, response, result ->
            if (response.statusCode == 201) {
                Toast.makeText(this, "Successfully registered with $email", Toast.LENGTH_SHORT).show()
                finish()
            }
            else Toast.makeText(this, "Failed to register - ${response.statusCode}", Toast.LENGTH_SHORT).show()
        }
    }

    fun register(view: android.view.View) {
        val email = binding.editEmail.text.toString()
        val password = binding.editPassword.text.toString()
        val confirmPassword = binding.editConfirmPassword.text.toString()

        if (password != confirmPassword) binding.textError.text = "Passwords don't match"

        postData(email, password)
    }

    fun back(view: android.view.View) {
        finish();
    }
}