package com.lifeblood.model;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // অথবা Integer


    private String email;

    @Column(name = "password_hash")
    private String passwordHash;

    private String name;
    private String phone;

    @Convert(converter = BloodGroupConverter.class)
    @Column(name = "blood_group")
    private BloodGroup bloodGroup;

    private String division;
    private String district;
    private String upazila;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Enumerated(EnumType.STRING)
    private Role role = Role.donor;

    @Column(name = "is_active")
    private boolean isActive = true;

    @Column(name = "is_verified")
    private boolean isVerified = false;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "last_donation_date")
    private Date lastDonationDate;

    @Column(name = "total_donations")
    private int totalDonations = 0;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at", updatable = false, insertable = false)
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "updated_at", insertable = false, updatable = false)
    private Date updatedAt;

    public enum Role { donor, recipient, admin }

    public enum BloodGroup {
        A_PLUS, A_NEG, B_PLUS, B_NEG, AB_PLUS, AB_NEG, O_PLUS, O_NEG;

        public static BloodGroup fromString(String value) {
            switch (value) {
                case "A+": return A_PLUS;
                case "A-": return A_NEG;
                case "B+": return B_PLUS;
                case "B-": return B_NEG;
                case "AB+": return AB_PLUS;
                case "AB-": return AB_NEG;
                case "O+": return O_PLUS;
                case "O-": return O_NEG;
                default: throw new IllegalArgumentException("Unknown blood group: " + value);
            }
        }
    }


    public Long getId() {
        return id;
    }


    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public BloodGroup getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(BloodGroup bloodGroup) { this.bloodGroup = bloodGroup; }

    public String getDivision() { return division; }
    public void setDivision(String division) { this.division = division; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getUpazila() { return upazila; }
    public void setUpazila(String upazila) { this.upazila = upazila; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public boolean isIsActive() { return isActive; }
    public void setIsActive(boolean isActive) { this.isActive = isActive; }

    public boolean isIsVerified() { return isVerified; }
    public void setIsVerified(boolean isVerified) { this.isVerified = isVerified; }

    public Date getLastDonationDate() { return lastDonationDate; }
    public void setLastDonationDate(Date lastDonationDate) { this.lastDonationDate = lastDonationDate; }

    public int getTotalDonations() { return totalDonations; }
    public void setTotalDonations(int totalDonations) { this.totalDonations = totalDonations; }

    public Date getCreatedAt() { return createdAt; }


    public Date getUpdatedAt() { return updatedAt; }
    public void setId(Long id) {
        this.id = id;
    }
}