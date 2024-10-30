package com.bus.app.repositorio;

import com.bus.app.modelo.TipoVehiculo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TipoVehiculoRepositorio  extends JpaRepository<TipoVehiculo,Long> {
}
