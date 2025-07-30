package com.lifeblood.controller;

import com.lifeblood.model.DonationRecord;
import com.lifeblood.service.DonationService;
import com.lifeblood.auth.Secured;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Path("/donations")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class DonationController {

    @Inject
    private DonationService donationService;

    @POST
    public void addDonation(DonationRecord record) {
        donationService.addDonation(record);
    }

    @GET
    @Path("/{donorId}")
    @Secured
    public List<DonationRecord> getDonations(@PathParam("donorId") Long donorId) {
        return donationService.getDonationsByDonor(donorId);
    }
}