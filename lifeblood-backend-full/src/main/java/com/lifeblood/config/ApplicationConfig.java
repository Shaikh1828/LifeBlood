package com.lifeblood.config;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;

@ApplicationPath("/api")
public class ApplicationConfig extends Application {
    // No implementation needed; serves as entry point for JAX-RS
}