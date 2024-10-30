package com.bus.app.modelo;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Setter
@Getter
@Entity
@Table(name= "carros")
public class Carro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String modelo;

    private String marca;

    @Column(name = "anyo")
    private Long anyo;

    @Column(name = "consumo")
    private Long consumo;

    @Column(name = "numeroUnidad", unique = true)
    private Long numeroUnidad;

    @Column(name = "tipo_vehiculo")
    private String tipoDeVehiculo;

    @JsonManagedReference
    @OneToMany(mappedBy = "carro", cascade = CascadeType.ALL)
    private List<Imagen> imagenes;

    @OneToMany(mappedBy = "carro", cascade = CascadeType.ALL)
    private List<Historial> registroHistorial;

    private Date ultimoCambioDeAceite;

    private Date siguienteCambioAceite;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "titulo_ID")
    private TituloUnidad titulo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "poliza_ID")
    private PolizaUnidad poliza;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bateria_ID")
    private Bateria bateria;













}