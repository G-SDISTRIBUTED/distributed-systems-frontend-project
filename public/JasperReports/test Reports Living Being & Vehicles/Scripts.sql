--Compile your reports in JasperSoft. It needs .jasper files

CREATE OR REPLACE FUNCTION test(
	id character varying,
	reference character varying)
    RETURNS TABLE(imei character varying, principal character varying, titulo1 character varying, respuesta1 character varying, titulo2 character varying, respuesta2 character varying) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$
DECLARE
    sqld character varying;
	r record;
BEGIN
if	reference='vehicle' then
	sqld='vehicle';
	principal= 'VEHICULO';
else
	sqld='living_being';
	principal= 'Ser Viviente';
end if;
sqld='select d.imei, t.* from device_'|| sqld ||' dv, devices d, '||sqld||'s t where t.id=dv.'|| sqld ||'_id and dv.device_id=d.id and t.id='|| id ||' and dv.end_date is null';
    FOR r IN execute(sqld)
        LOOP
            imei := r.imei;
			titulo1= 'Nombre';
			respuesta1= r.name;
			if	reference='vehicle' then
				titulo2='Marca';
				respuesta2=r.brand;
			else
				titulo2='EMail';
				respuesta2=r.email;
			end if;
        end LOOP;
    return next;
return;
END;
$BODY$;


CREATE OR REPLACE FUNCTION public.test_last_100(
	imei character varying)
    RETURNS TABLE(lat numeric, lng numeric, device_time timestamp without time zone) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$
DECLARE
BEGIN
return query execute('select latitude,longitude,device_time_at from data_'||imei||' limit 100');
END;
$BODY$;
