package com.lifeblood.controller;

import com.lifeblood.model.User;
import com.lifeblood.service.UserService;
import com.lifeblood.auth.Secured;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

@Path("/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserController {

    @Inject
    private UserService userService;

    @PUT
    @Path("/{id}")
    @Secured
    public void updateUser(@PathParam("id") Long id, User user) {
        userService.updateProfile(user);
    }

    @GET
    @Path("/{id}")
    @Secured
    public User getUser(@PathParam("id") Long id) {
        return userService.getById(id);
    }
}