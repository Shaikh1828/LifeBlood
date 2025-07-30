package com.lifeblood.controller;

import com.lifeblood.model.User;
import com.lifeblood.service.UserService;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Path("/search")
@Produces(MediaType.APPLICATION_JSON)
public class SearchController {

    @Inject
    private UserService userService;

    @GET
    public List<User> search(@QueryParam("bloodGroup") String bloodGroup,
                             @QueryParam("division") String division,
                             @QueryParam("district") String district,
                             @QueryParam("upazila") String upazila) {
        return userService.findAvailableDonors(bloodGroup, division, district, upazila);
    }
}