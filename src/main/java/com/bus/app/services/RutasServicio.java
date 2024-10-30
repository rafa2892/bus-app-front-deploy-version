package com.bus.app.services;


import com.bus.app.modelo.Ruta;

import java.util.List;

public interface RutasServicio {
List<Ruta> findAll();
Ruta save(Ruta ruta);
}
