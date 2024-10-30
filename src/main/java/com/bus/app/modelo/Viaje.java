package com.bus.app.modelo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@Entity
@Table(name="viajes")
public class Viaje {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    private Date fechaViaje;

    @ManyToOne
    @JoinColumn(name = "carro_id")
    public Carro carro;

    @ManyToOne
    @JoinColumn(name = "conductor_id")
    public Conductor conductor;

    @Column(name = "kilometraje")
    private Integer kilometraje;

    @Column(name = "horasEspera")
    private Integer horasEspera;

    @ManyToOne
    @JoinColumn(name = "ruta_id")
    public Ruta ruta;

    @ManyToOne
    @JoinColumn(name = "empresa_servicio_ID")
    public Empresa empresaServicio;

}
