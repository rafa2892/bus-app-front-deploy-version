package com.bus.app.services;

import com.bus.app.modelo.Ruta;
import com.bus.app.repositorio.RutasRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RutasServicioImpl implements RutasServicio {

    @Autowired
    private RutasRepositorio rutaRepositorio;


    public List<Ruta> findAll() {
        return rutaRepositorio.findAll();
    }

    @Override
    public Ruta save(Ruta ruta) {
        return rutaRepositorio.save(ruta);
    }

}
