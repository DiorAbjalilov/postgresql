create table employer (
    id bigserial primary key,
    name varchar(80) not null,
    degree varchar(80) not null,
    salary numeric(15) not null,
    job_id bigint references job(id)
)

create table job (
    id bigserial primary key,
    title varchar(80) not null,
)