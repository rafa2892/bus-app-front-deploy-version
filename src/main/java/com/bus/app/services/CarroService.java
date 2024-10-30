package com.bus.app.services;

import com.bus.app.DTO.CarroDTO;
import com.bus.app.modelo.Carro;
import com.bus.app.modelo.Historial;

public interface CarroService {
    Carro getCarro(CarroDTO carro);

    Historial save(Historial historial);

    void parametrizarHistorial(Historial historial);

}
