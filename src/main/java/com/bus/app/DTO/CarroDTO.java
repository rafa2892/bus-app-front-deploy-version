package com.bus.app.DTO;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CarroDTO {

    private Long id;

    private String modelo;

    private String marca;

    private Long anyo;

    private Long consumo;

    private Long numeroUnidad;

    private List<ImagenDTO> imagenes;

    private String tipoDeVehiculo;

}
