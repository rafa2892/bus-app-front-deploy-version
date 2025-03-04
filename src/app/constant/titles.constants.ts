export const TITLES = {



    // FORMULARIO REGISTRAR CONDUCTOR
    NO_VIAJES_REGISTERED: (name:string) => 'EL conductor ' + name + ' no tiene viajes registrados',
    NO_VIAJES: '0',
    ERROR_REQUIRED_FIELDS: 'Por favor, complete todos los campos requeridos',
    ADD_DRIVER: 'Registrar conductor',
    EDIT_DRIVER: 'Editar conductor',
    DELETE_DRIVER: 'Eliminar conductor',
    VIEW_CONDUCTOR: 'Detalles del conductor',
    NO_DATA: 'Sin datos',
    KM_REGISTERED: 'Kilómetros registrados',
    KM : 'Km.',
    CREATED_BY_USER: 'Dado alta usuario ',
    REGISTERED_TRIPS: 'N. Viajes',
    REGISTRATION_DATE: 'Fecha de alta',
    DNI_DRIVER: 'Cedula del conductor',
    DATE_OF_BIRTH: 'Fecha de nacimiento (DD/MM/YYYY)',
    NAMES : 'Nombres',
    LAST_NAMES : 'Apellidos',
    
    //LISTA CONDUCTORES
    DRIVER_DEFAULT_ORDER_BY : 'fechaAlta-desc',
    SORTER_BY_DRIVERS : new Map<string, string>([
      ['nombre-asc', 'Nombre (A → Z)'],
      ['nombre-desc', 'Nombre (Z → A)'],
      ['apellido-asc', 'Apellido (A → Z)'],
      ['apellido-desc', 'Apellido (Z → A)'],
      ['fechaAlta-desc', 'Fecha alta (Recientes)'],
      ['fechaAlta-asc', 'Fecha alta (Antiguos)'],
    ]),

    NEW_DRIVER_SUCCESSFUL_SAVED_MSJ : "Conductor registrado con éxito",

    //lISTA CARROS
    CAR_DEFAULT_ORDER_BY_DATE : 'fechaAlta-desc',
    SORTER_BY_CARS : new Map<string, string>([

      ['numeroUnidad-asc', 'Num uni. Menor a mayor'],
      ['numeroUnidad-desc', 'Num uni.  Mayor a menor'],

      ['marca-asc', 'Marca (A → Z)'],
      ['marca-desc', 'Marca (Z → A)'],

      ['modelo-asc', 'Modelo (A → Z)'],
      ['modelo-desc', 'Modelo (Z → A)'],

      ['anyo-asc', 'Año (Más recientes)'],
      ['anyo-desc', 'Año (Más nuevos)'],

      ['fechaAlta-asc', 'Fecha alta (Antiguos)'],
      ['fechaAlta-desc', 'Fecha alta (Recientes)'],
    ]),

    NEW_CAR_SUCCESSFUL_SAVED_MSJ : "Vehículo guardado con éxito.",
    


    //GENERALES
    LOGIN: 'Iniciar Sesión',
    REGISTER: 'Registrarse',
    HOME: 'Inicio',
    BACK: 'Volver',
    SAVE: 'Guardar',
    EDIT: 'Editar',
    ERROR_ONLY_NUMBERS: '***Solo se pueden introducir números***',
    ERROR_SERVIDOR_BACK : 'Ha ocurrido un error. Intenta nuevamente o contacte con el administrador.',


    //REGISTRAR-VIAJES
    DESTINY: 'Destino',
    FROM: 'Desde',
    PLACEHOLDER_DISTANCE_KMS : 'Ingrese distancia en KM',
    SELECT_ROUTE : 'Ruta',
    DISTANCE_KMS : 'Distancia en KM',
    ENDURANCE_TRAVEL_LABEL : 'Tiempo aprox. Viaje (HH:MM)',
    ENDURANCE_TRAVEL_PLACEHOLDER : '00:00 horas',
    ROUTE:'Ruta',
    SELECT_DRIVER:'Conductor',
    SELECT_CAR: 'Vehiculo',
    NEW_ROUTE:'Nueva ruta',
    COMPANY_NAME: 'Nombre de la empresa (servicio)',
    COMPANY_NAME_PLACEHOLDER: 'Nombre de la empresa',
    DATA_FOUND: 'Datos encontrados automáticamente',
    DATA_NO_FOUND: 'Datos no encontrados automáticamente, favor completar manualmente',


    //LISTA DE VIAJES LITERALS
    FILTROS_TITULO_INPUT: 'Filtros',
    SWITCH_BUTTON_FILTERS_ACTIVE:'Activar filtros',
    SWITCH_BUTTON_FILTERS_DESACTIVE:'Desactivar filtros',
    RESET_FILTER_TITLE_BUTTON : 'Resetear filtros',

    //POP-UP GENERICO 
    CONFIRM_MODAL_MSJ : 'Confirmar',
    CANCEL_MODAL_MSJ : 'Cancelar',
    CLOSE_MODAL_MSJ: 'Cerrar',

    //POP-UP MODAL DE CONFIRMACIÓN  POPUP-MENSAJE-CONFIRMAR-VIAJE
    SERVICE_DETAILS :'Detalles del servicio',
    EDITING_SERVICE :'Editando servicio',
    CONFIRM_SERVICE :'Confirmar servicio',

    //POP-UP MODAL FILTROS
    APPLY_FILTERS : 'Aplicar filtros',
    FILTERS_TITLE : 'Filtros',
    FILTERS_INPUT_NAME_PLACEHOLDER : 'Conductor',
    FILTERS_INPUT_CAR_PLACEHOLDER : 'Carro',

    //REGISTRAR CARRO LITERALES
    COMMENTS_LABEL_TITLE : 'Observaciones/Comentarios',
    NAME_COMPANY_PERSON_TITLE : 'Nombre/Razón social',
    TITLE_DISABLED_BTON_NEXT_STEP : 'Complete los datos obligarios para avanzar al siguiente segmento del formulario o guarde solo los datos basicos del vehiculo',

    //CONFIRM MODALS LITERALS
    RESTORE_MSJ_CONFIRM_TITLE_MODAL : 'Confirma',
    RESTORE_MSJ_CONFIRM_MODAL : 'Se reestablecera el formulario, ¿Desea continuar?',
    SAVE_BASIC_INFO_CAR_TOOLTIP : 'Guardar los datos basicos del carro',

    EXCEL_EXPORT_VIAJES_TYPE_BETWEEN_DATES : 'por-fechas',
    EXCEL_EXPORT_VIAJES_TYPE_SPECIFIC_DAY : 'dia-especifico',
    EXCEL_EXPORT_VIAJES_TYPE_TODAY : 'hoy',
    EXCEL_EXPORT_VIAJES_TYPE_YESTERDAY : 'ayer',

    //Lista historial
    ERROR_NOT_REGISTERS_FOUND: 'No se han encontrado registros para las fechas introducidas',
    ERROR_NOT_DATES_SUBMIT: 'Para filtrar por fecha(s), tiene que al menos introducir una fecha o ambas.',
    CHECK_DETAILS_HISTORIAL : 'Ver detalles',
    CHECK_SERVICE_DETAIL_HISTORIAL : 'Ver detalles del servicio',
    EDIT_HISTORIAL : 'Editar historial',
    DELETE_HISTORIAL : 'Editar historial',
    ADD_HISTORIAL : 'Añadir historial'
  };