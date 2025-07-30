package com.lifeblood.service;

import com.lifeblood.model.DonationRecord;
import com.lifeblood.model.User;
import com.lifeblood.repository.DonationRecordRepository;
import com.lifeblood.repository.UserRepository;

import javax.ejb.Stateless;
import javax.inject.Inject;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Stateless
public class DonationService {

    @Inject
    private DonationRecordRepository donationRepo;

    @Inject
    private UserRepository userRepo;

    public void addDonation(DonationRecord record) {
        System.out.println("Donor: " + record.getDonor());
        if (record.getDonor() != null && record.getDonor().getId() != null) {
            User donor = userRepo.findById(record.getDonor().getId());
            if (donor == null) {
                throw new IllegalArgumentException("No user found with ID: " + record.getDonor().getId());
            }
            record.setDonor(donor);
        } else {
            throw new IllegalArgumentException("Donor ID is required");
        }

        donationRepo.save(record);

        User donor = record.getDonor();
        donor.setLastDonationDate(record.getDonationDate());
        donor.setTotalDonations(donor.getTotalDonations() + 1);
        userRepo.update(donor);
    }


    public List<DonationRecord> getDonationsByDonor(Long donorId) {
        return donationRepo.findByDonor(donorId);
    }
}