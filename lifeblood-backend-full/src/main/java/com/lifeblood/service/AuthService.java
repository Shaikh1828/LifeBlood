package com.lifeblood.service;

import com.lifeblood.model.User;
import com.lifeblood.repository.UserRepository;

import javax.ejb.Stateless;
import javax.inject.Inject;
import java.util.Date;
import java.util.UUID;
import com.lifeblood.util.PasswordUtil;

@Stateless
public class AuthService {

    @Inject
    private UserRepository userRepository;

    public void register(User user) {
        String hashed = PasswordUtil.hashPassword(user.getPasswordHash());
        user.setPasswordHash(hashed);
//        user.setCreatedAt(new Date());
        userRepository.save(user);
    }


//    public User login(String email, String password) {
//        User user = userRepository.findByEmail(email);
//        if (user != null && user.getPasswordHash().equals(password)) {
//            return user;
//        }
//        return null;
//    }
    public User login(String email, String plainPassword) {
        User user = userRepository.findByEmail(email);
        if (user == null) return null;

        boolean valid = PasswordUtil.checkPassword(plainPassword, user.getPasswordHash());
        return valid ? user : null;
    }

}