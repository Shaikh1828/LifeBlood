//package com.lifeblood.controller;
//
//import com.lifeblood.model.User;
//import com.lifeblood.service.UserService;
//import com.lifeblood.auth.Secured;
//
//import javax.inject.Inject;
//import javax.ws.rs.*;
//import javax.ws.rs.core.MediaType;
//
//@Path("/users")
//@Produces(MediaType.APPLICATION_JSON)
//@Consumes(MediaType.APPLICATION_JSON)
//public class UserController {
//
//    @Inject
//    private UserService userService;
//
//    @PUT
//    @Path("/{id}")
//    @Secured
//    public void updateUser(@PathParam("id") Long id, User user) {
//        userService.updateProfile(user);
//    }
//
//    @GET
//    @Path("/{id}")
//    @Secured
//    public User getUser(@PathParam("id") Long id) {
//        return userService.getById(id);
//    }
//}
package com.lifeblood.controller;

import com.lifeblood.model.User;
import com.lifeblood.service.UserService;
import com.lifeblood.auth.Secured;
import com.lifeblood.util.PasswordUtil;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.logging.Logger;

@Path("/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserController {

    private static final Logger logger = Logger.getLogger(UserController.class.getName());

    @Inject
    private UserService userService;

    @PUT
    @Path("/{id}")
    @Secured
    public Response updateUser(@PathParam("id") Long id, User updatedUser) {
        try {
            logger.info("Updating user profile for ID: " + id);
            logger.info("Update data received: " + updatedUser.toString());

            // Validate required fields
            if (updatedUser.getName() == null || updatedUser.getName().trim().isEmpty()) {
                logger.warning("Name is required but not provided");
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("{\"error\": \"Name is required\"}")
                        .build();
            }

            if (updatedUser.getEmail() == null || updatedUser.getEmail().trim().isEmpty()) {
                logger.warning("Email is required but not provided");
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("{\"error\": \"Email is required\"}")
                        .build();
            }

            // Get existing user
            User existingUser = userService.getById(id);
            if (existingUser == null) {
                logger.warning("User not found with ID: " + id);
                return Response.status(Response.Status.NOT_FOUND)
                        .entity("{\"error\": \"User not found\"}")
                        .build();
            }

            // Update fields
            existingUser.setName(updatedUser.getName().trim());
            existingUser.setEmail(updatedUser.getEmail().trim());

            // Update optional fields
            if (updatedUser.getPhone() != null) {
                existingUser.setPhone(updatedUser.getPhone().trim());
            }

            if (updatedUser.getDivision() != null) {
                existingUser.setDivision(updatedUser.getDivision().trim());
            }

            if (updatedUser.getDistrict() != null) {
                existingUser.setDistrict(updatedUser.getDistrict().trim());
            }

            if (updatedUser.getUpazila() != null) {
                existingUser.setUpazila(updatedUser.getUpazila().trim());
            }

            if (updatedUser.getAddress() != null) {
                existingUser.setAddress(updatedUser.getAddress().trim());
            }

            // Handle password update if provided
            // শুধু নতুন plain text পাসওয়ার্ড এলে হ্যাশ করুন
            if (updatedUser.getPasswordHash() != null && !updatedUser.getPasswordHash().trim().isEmpty()) {
                if (!updatedUser.getPasswordHash().equals(existingUser.getPasswordHash())) {
                    // শুধুমাত্র নতুন plain password হলে hash করুন
                    String hashedPassword = PasswordUtil.hashPassword(updatedUser.getPasswordHash());
                    existingUser.setPasswordHash(hashedPassword);
                }
            }


            // Update user in database
            userService.updateProfile(existingUser);
            logger.info("User profile updated successfully for ID: " + id);

            // Return success response
            return Response.ok()
                    .entity("{\"message\": \"Profile updated successfully\", \"success\": true}")
                    .build();

        } catch (Exception e) {
            logger.severe("Error updating user profile: " + e.getMessage());
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"Failed to update profile: " + e.getMessage() + "\"}")
                    .build();
        }
    }

    @GET
    @Path("/{id}")
    @Secured
    public Response getUser(@PathParam("id") Long id) {
        try {
            logger.info("Fetching user with ID: " + id);

            User user = userService.getById(id);
            if (user == null) {
                logger.warning("User not found with ID: " + id);
                return Response.status(Response.Status.NOT_FOUND)
                        .entity("{\"error\": \"User not found\"}")
                        .build();
            }

            logger.info("User fetched successfully: " + user.getEmail());
            return Response.ok(user).build();

        } catch (Exception e) {
            logger.severe("Error fetching user: " + e.getMessage());
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"Failed to fetch user: " + e.getMessage() + "\"}")
                    .build();
        }
    }
}