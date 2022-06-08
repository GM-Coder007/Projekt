package com.example.gymfinder

class user(var email: String, var password: String)
{
    override fun toString(): String {
        return "\n Email: $email."
    }
}