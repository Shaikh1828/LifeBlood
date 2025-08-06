package com.lifeblood.filter;

import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;
import javax.ws.rs.ext.Provider;
import java.io.IOException;

@Provider
public class CorsFilter implements ContainerResponseFilter {

    @Override
    public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext) throws IOException {
        try {
            // Basic CORS headers
            responseContext.getHeaders().add("Access-Control-Allow-Origin", "http://localhost:5173");
            responseContext.getHeaders().add("Access-Control-Allow-Headers", "origin, content-type, accept, authorization");
            responseContext.getHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");

            // এটা খুবই important - Authorization header expose করার জন্য
            responseContext.getHeaders().add("Access-Control-Expose-Headers", "Authorization, Content-Type");

            System.out.println("CORS headers added successfully");

        } catch (Exception e) {
            System.err.println("CORS Filter Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}