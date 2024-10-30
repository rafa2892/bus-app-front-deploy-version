package com.bus.app.services;


import com.bus.app.modelo.TipoVehiculo;
import com.bus.app.repositorio.TipoVehiculoRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TipoVehiculoServicioImpl implements TipoVehiculoServicio {

    @Autowired
    TipoVehiculoRepositorio tipoVehiculoRepositorio;

    @Override
    public List<TipoVehiculo> findAll() {
        return tipoVehiculoRepositorio.findAll();
    }
}
