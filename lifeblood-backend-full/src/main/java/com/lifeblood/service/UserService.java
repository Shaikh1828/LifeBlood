package com.lifeblood.service;

import com.lifeblood.model.User;
import com.lifeblood.repository.UserRepository;

import javax.ejb.Stateless;
import javax.inject.Inject;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Stateless
public class UserService {

    @Inject
    private UserRepository userRepository;

    public List<User> findAvailableDonors(String bloodGroupRaw, String division, String district, String upazila) {
        User.BloodGroup bloodGroup = bloodGroupRaw != null ? User.BloodGroup.fromString(bloodGroupRaw) : null;

        List<User> donors = userRepository.findByLocationAndBlood(bloodGroup, division, district, upazila);

        return donors.stream()
                .filter(d -> {
                    if (d.getLastDonationDate() == null) return true;
                    LocalDateTime nextEligible = d.getLastDonationDate().toInstant()
                            .atZone(ZoneId.systemDefault())
                            .toLocalDateTime()
                            .plusMonths(4);
                    return nextEligible.isBefore(LocalDateTime.now());
                })
                .collect(Collectors.toList());
    }

    public void updateProfile(User user) {
        user.setId(user.getId());
        userRepository.update(user);
    }

    public User getById(Long id) {
        return userRepository.findById(id);
    }
}