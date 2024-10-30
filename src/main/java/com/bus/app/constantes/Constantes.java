package com.bus.app.constantes;

import java.util.HashMap;
import java.util.Map;

public class Constantes {

    public final static String REGISTRO_VIAJE = "Nuevo viaje registrado";
    public final static Long REGISTRO_VIAJE_ID = 1L ;
    public final static String REPARACION = "Reparación";
    public final static Long REPARACION_ID = 2L ;
    public final static String OTROS = "Otros";
    public final static Long OTROS_ID = 3L;
    public static Map<Long,String> getTiposHistoriales() {
        Map<Long, String> datos = new HashMap<>();
        datos.put(Constantes.REGISTRO_VIAJE_ID, Constantes.REGISTRO_VIAJE);
        datos.put(Constantes.REPARACION_ID, Constantes.REPARACION);
        datos.put(Constantes.OTROS_ID, Constantes.OTROS);
        return datos;
    }


}
