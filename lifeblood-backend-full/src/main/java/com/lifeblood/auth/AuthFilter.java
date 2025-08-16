package com.lifeblood.auth;

import com.lifeblood.util.JwtUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;

import javax.annotation.Priority;
import javax.ws.rs.Priorities;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.container.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.Provider;
import java.io.IOException;

@Secured
@Provider
@Priority(Priorities.AUTHENTICATION)
public class AuthFilter implements ContainerRequestFilter {

    @Context
    private ResourceInfo resourceInfo;

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        // Preflight request হলে সরাসরি pass করে দেবে
        if ("OPTIONS".equalsIgnoreCase(requestContext.getMethod())) {
            return;
        }

        String authHeader = requestContext.getHeaderString(HttpHeaders.AUTHORIZATION);
        System.out.println("Received Auth Header: " + authHeader);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new WebApplicationException("Authorization header missing", Response.Status.UNAUTHORIZED);
        }

        String token = authHeader.substring("Bearer ".length());

        try {
            Jws<Claims> claims = JwtUtil.parseToken(token);
            String userId = claims.getBody().getSubject();
            String role = claims.getBody().get("role", String.class);

            // চাইলে এখানে userId / role দিয়ে context set করতে পারো
        } catch (JwtException e) {
            System.out.println("JWT validation failed: " + e.getMessage());
            e.printStackTrace();
            throw new WebApplicationException("Invalid or expired token", Response.Status.UNAUTHORIZED);
        }
    }

}
