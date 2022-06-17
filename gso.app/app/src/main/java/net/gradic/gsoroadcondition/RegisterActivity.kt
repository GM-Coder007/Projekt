package net.gradic.gsoroadcondition

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.github.kittinunf.fuel.Fuel
import com.github.kittinunf.fuel.gson.jsonBody
import com.github.kittinunf.fuel.gson.responseObject
import com.github.kittinunf.fuel.httpPost
import com.github.kittinunf.result.Result;
import net.gradic.gsoroadcondition.databinding.ActivityMainBinding
import net.gradic.gsoroadcondition.databinding.ActivityRegisterBinding

class RegisterActivity : AppCompatActivity() {
    private lateinit var binding: ActivityRegisterBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        //setContentView(R.layout.activity_register)
        binding = ActivityRegisterBinding.inflate(layoutInflater)
        setContentView(binding.root)
    }

    fun register(view: android.view.View) {
        val email = binding.editEmail.text
        val password = binding.editPassword.text
        binding.editConfirmPassword.text

        data class TokenModel(var token: String = "")

        Fuel.post("http://192.168.2.12:4000/users/register").jsonBody("{ email: \"$email\", password: \"$password\"}")
            .response { request, response, result ->

                when (result) {
                    is Result.Failure -> {
                        val ex = result.getException()
                        binding.textError.text = "${result.get()} $ex"
                    }
                    is Result.Success -> {
                        val data = result.get()
                        binding.textError.text = data.toString()
                    }
                }
            }
    }
    fun back(view: android.view.View) {
        finish();
    }
}