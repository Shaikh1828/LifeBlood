package com.lifeblood.service;

import com.lifeblood.model.User;
import com.lifeblood.repository.UserRepository;

import javax.ejb.Stateless;
import javax.inject.Inject;
import java.util.List;

@Stateless
public class AdminService {

    @Inject
    private UserRepository userRepo;

    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    public void verifyUser(Long id) {
        User user = userRepo.findById(id);
        if (user != null) {
            user.setIsVerified(true);
            userRepo.update(user);
        }
    }

    public void disableUser(Long id) {
        User user = userRepo.findById(id);
        if (user != null) {
            user.setIsActive(false);
            userRepo.update(user);
        }
    }
}