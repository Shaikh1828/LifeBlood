package com.lifeblood.controller;

import com.lifeblood.model.User;
import com.lifeblood.service.AuthService;
import com.lifeblood.util.JwtUtil;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/auth")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AuthController {

    @Inject
    private AuthService authService;

    @POST
    @Path("/register")
    public Response register(User user) {
        authService.register(user);
        return Response.ok().build();
    }

    @POST
    @Path("/login")
    public Response login(User loginRequest) {
        try {
            User user = authService.login(loginRequest.getEmail(), loginRequest.getPasswordHash());

            if (user == null) {
                System.out.println("Login failed: Invalid credentials");
                return Response.status(Response.Status.UNAUTHORIZED).build();
            }

            String token = JwtUtil.generateToken(user.getId().toString(), user.getRole().toString());
            System.out.println("Generated token: " + token);
            System.out.println("Setting Authorization header: Bearer " + token);

            Response response = Response.ok()
                    .header("Authorization", "Bearer " + token)
                    .entity(user)
                    .build();

            System.out.println("Response headers: " + response.getHeaders());
            return response;

        } catch (Exception e) {
            System.err.println("Login error: " + e.getMessage());
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
        }
    }
}