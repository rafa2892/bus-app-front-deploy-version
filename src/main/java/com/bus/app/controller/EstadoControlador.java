package com.bus.app.controller;

import com.bus.app.modelo.Estado;
import com.bus.app.services.EstadoServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rutas/")
@CrossOrigin
public class EstadoControlador {

    @Autowired
    private EstadoServicio estadoServicio;

    @GetMapping("/estados")
    public List<Estado> listAll() {
        return estadoServicio.findAll();
    }

}
