package com.bus.app.controller;

import com.bus.app.modelo.Carro;
import com.bus.app.modelo.Historial;
import com.bus.app.services.RegistroHistorialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/")
@CrossOrigin
public class HistorialController {

    @Autowired
    private RegistroHistorialService registroHistorialService;

    @GetMapping("/historial")
    public List<Historial> listAll() {
        return registroHistorialService.findAll();
    }

}
