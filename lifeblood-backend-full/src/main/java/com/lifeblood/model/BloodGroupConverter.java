package com.lifeblood.model;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter(autoApply = true)
public class BloodGroupConverter implements AttributeConverter<User.BloodGroup, String> {

    @Override
    public String convertToDatabaseColumn(User.BloodGroup bloodGroup) {
        if (bloodGroup == null) return null;
        switch (bloodGroup) {
            case A_PLUS: return "A+";
            case A_NEG: return "A-";
            case B_PLUS: return "B+";
            case B_NEG: return "B-";
            case AB_PLUS: return "AB+";
            case AB_NEG: return "AB-";
            case O_PLUS: return "O+";
            case O_NEG: return "O-";
            default: throw new IllegalArgumentException("Unknown blood group: " + bloodGroup);
        }
    }

    @Override
    public User.BloodGroup convertToEntityAttribute(String dbValue) {
        if (dbValue == null) return null;
        switch (dbValue) {
            case "A+": return User.BloodGroup.A_PLUS;
            case "A-": return User.BloodGroup.A_NEG;
            case "B+": return User.BloodGroup.B_PLUS;
            case "B-": return User.BloodGroup.B_NEG;
            case "AB+": return User.BloodGroup.AB_PLUS;
            case "AB-": return User.BloodGroup.AB_NEG;
            case "O+": return User.BloodGroup.O_PLUS;
            case "O-": return User.BloodGroup.O_NEG;
            default: throw new IllegalArgumentException("Unknown blood group value from DB: " + dbValue);
        }
    }
}

