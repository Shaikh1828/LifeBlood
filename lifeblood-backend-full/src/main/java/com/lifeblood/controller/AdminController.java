package com.lifeblood.controller;

import com.lifeblood.model.User;
import com.lifeblood.service.AdminService;
import com.lifeblood.auth.Secured;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Path("/admin")
@Produces(MediaType.APPLICATION_JSON)
public class AdminController {

    @Inject
    private AdminService adminService;

    @GET
    @Path("/users")
    public List<User> getAllUsers() {
        return adminService.getAllUsers();
    }

    @PUT
    @Path("/verify/{id}")
    @Secured
    public void verifyUser(@PathParam("id") Long id) {
        adminService.verifyUser(id);
    }

    @PUT
    @Path("/disable/{id}")
    @Secured
    public void disableUser(@PathParam("id") Long id) {
        adminService.disableUser(id);
    }
}
