-- Database Creation - Run database commands SEPARATELY, then comment out and run rest of file

-- Database: ccsb

-- DROP DATABASE IF EXISTS ccsb;

-- CREATE DATABASE ccsb
--     WITH
--     OWNER = postgres
--     ENCODING = 'UTF8'
--     TABLESPACE = pg_default
--     CONNECTION LIMIT = -1
--     IS_TEMPLATE = False;

-- Sequence Creation - This added on 9/29/2022

-- SEQUENCE: public.student_id_seq

-- DROP SEQUENCE IF EXISTS public.student_id_seq;

CREATE SEQUENCE IF NOT EXISTS public.student_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.student_id_seq
    OWNER TO postgres;

-- SEQUENCE: public.teacher_id_seq

-- DROP SEQUENCE IF EXISTS public.teacher_id_seq;

CREATE SEQUENCE IF NOT EXISTS public.teacher_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.teacher_id_seq
    OWNER TO postgres;


-- SEQUENCE: public.classroom_id_seq

-- DROP SEQUENCE IF EXISTS public.classroom_id_seq;

CREATE SEQUENCE IF NOT EXISTS public.classroom_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.classroom_id_seq
    OWNER TO postgres;

-- SEQUENCE: public.question_set_culture_id_seq

-- DROP SEQUENCE IF EXISTS public.question_set_culture_id_seq;

CREATE SEQUENCE IF NOT EXISTS public.question_set_culture_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.question_set_culture_id_seq
    OWNER TO postgres;

-- SEQUENCE: public.meta_question_id_seq

-- DROP SEQUENCE IF EXISTS public.meta_question_id_seq;

CREATE SEQUENCE IF NOT EXISTS public.meta_question_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.meta_question_id_seq
    OWNER TO postgres;

-- SEQUENCE: public.enrollment_id_seq

-- DROP SEQUENCE IF EXISTS public.enrollment_id_seq;

CREATE SEQUENCE IF NOT EXISTS public.enrollment_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.enrollment_id_seq
    OWNER TO postgres;

-- SEQUENCE: public.question_id_seq

-- DROP SEQUENCE IF EXISTS public.question_id_seq;

CREATE SEQUENCE IF NOT EXISTS public.question_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.question_id_seq
    OWNER TO postgres;

-- SEQUENCE: public.session_id_seq

-- DROP SEQUENCE IF EXISTS public.session_id_seq;

CREATE SEQUENCE IF NOT EXISTS public.session_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.session_id_seq
    OWNER TO postgres;

-- SEQUENCE: public.session_question_id_seq

-- DROP SEQUENCE IF EXISTS public.session_question_id_seq;

CREATE SEQUENCE IF NOT EXISTS public.session_question_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.session_question_id_seq
    OWNER TO postgres;

-- SEQUENCE: public.resource_culture_links_id_seq

-- DROP SEQUENCE IF EXISTS public.resource_culture_links_id_seq;

CREATE SEQUENCE IF NOT EXISTS public.resource_culture_links_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.resource_culture_links_id_seq
    OWNER TO postgres;

-- SEQUENCE: public.resource_qsc_links_id_seq

-- DROP SEQUENCE IF EXISTS public.resource_qsc_links_id_seq;

CREATE SEQUENCE IF NOT EXISTS public.resource_qsc_links_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.resource_qsc_links_id_seq
    OWNER TO postgres;

-- SEQUENCE: public.resource_question_links_id_seq

-- DROP SEQUENCE IF EXISTS public.resource_question_links_id_seq;

CREATE SEQUENCE IF NOT EXISTS public.resource_question_links_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.resource_question_links_id_seq
    OWNER TO postgres;

-- END OF SEQUENCE CREATION


-- Table: public.student

-- DROP TABLE IF EXISTS public.student;

CREATE TABLE IF NOT EXISTS public.student
(
    id bigint NOT NULL DEFAULT nextval('student_id_seq'::regclass),
    username character varying(32) COLLATE pg_catalog."default" NOT NULL,
    email character varying(64) COLLATE pg_catalog."default",
    password character varying(512) COLLATE pg_catalog."default" NOT NULL,
    nickname character varying(32) COLLATE pg_catalog."default",
    age smallint,
    registration_date date,
    zip character varying(5) COLLATE pg_catalog."default",
    CONSTRAINT student_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.student
    OWNER to postgres;


-- Table: public.teacher

-- DROP TABLE IF EXISTS public.teacher;

CREATE TABLE IF NOT EXISTS public.teacher
(
    id integer NOT NULL DEFAULT nextval('teacher_id_seq'::regclass),
    username character varying(32) COLLATE pg_catalog."default" NOT NULL,
    first_name character varying(32) COLLATE pg_catalog."default" NOT NULL,
    last_name character varying(32) COLLATE pg_catalog."default" NOT NULL,
    email character varying(32) COLLATE pg_catalog."default" NOT NULL,
    password character varying(512) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT teacher_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.teacher
    OWNER to postgres;


-- Table: public.question_set

-- DROP TABLE IF EXISTS public.question_set;

CREATE TABLE IF NOT EXISTS public.question_set
(
    code character(4) COLLATE pg_catalog."default" NOT NULL,
    name character varying(32) COLLATE pg_catalog."default",
    CONSTRAINT question_set_pkey PRIMARY KEY (code)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.question_set
    OWNER to postgres;


-- Table: public.culture

-- DROP TABLE IF EXISTS public.culture;

CREATE TABLE IF NOT EXISTS public.culture
(
    code character(4) COLLATE pg_catalog."default" NOT NULL,
    name character varying(32) COLLATE pg_catalog."default",
    lang character(5) COLLATE pg_catalog."default",
    icon bytea,
    CONSTRAINT culture_pkey PRIMARY KEY (code)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.culture
    OWNER to postgres;


-- Table: public.resources

-- DROP TABLE IF EXISTS public.resources;

CREATE TABLE IF NOT EXISTS public.resources
(
    title character varying(256) COLLATE pg_catalog."default" NOT NULL,
    url character varying(512) COLLATE pg_catalog."default",
    start_date date,
    end_date date,
    memo text COLLATE pg_catalog."default",
    code character(10) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT resources_pkey PRIMARY KEY (code)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.resources
    OWNER to postgres;


-- Table: public.classroom

-- DROP TABLE IF EXISTS public.classroom;

CREATE TABLE IF NOT EXISTS public.classroom
(
    id integer NOT NULL DEFAULT nextval('classroom_id_seq'::regclass),
    teacher_id integer,
    question_set_code character(4) COLLATE pg_catalog."default" NOT NULL,
    name character varying(32) COLLATE pg_catalog."default",
    CONSTRAINT classroom_pkey PRIMARY KEY (id),
    CONSTRAINT classroom_question_set_code_fk FOREIGN KEY (question_set_code)
        REFERENCES public.question_set (code) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT classroom_teacher_id_fk FOREIGN KEY (teacher_id)
        REFERENCES public.teacher (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.classroom
    OWNER to postgres;

-- Index: fki_classroom_question_set_code_fk

-- DROP INDEX IF EXISTS public.fki_classroom_question_set_code_fk;

CREATE INDEX IF NOT EXISTS fki_classroom_question_set_code_fk
    ON public.classroom USING btree
    (question_set_code COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

-- Index: fki_classroom_teacher_fk

-- DROP INDEX IF EXISTS public.fki_classroom_teacher_fk;

CREATE INDEX IF NOT EXISTS fki_classroom_teacher_fk
    ON public.classroom USING btree
    (teacher_id ASC NULLS LAST)
    TABLESPACE pg_default;


-- Table: public.question_set_culture

-- DROP TABLE IF EXISTS public.question_set_culture;

CREATE TABLE IF NOT EXISTS public.question_set_culture
(
    id smallint NOT NULL DEFAULT nextval('question_set_culture_id_seq'::regclass),
    question_set_code character(4) COLLATE pg_catalog."default" NOT NULL,
    description character varying(32) COLLATE pg_catalog."default",
    isdefault boolean NOT NULL DEFAULT false,
    culture_code character(4) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT question_set_culture_pkey PRIMARY KEY (id),
    CONSTRAINT qsc_culture_code_fk FOREIGN KEY (culture_code)
        REFERENCES public.culture (code) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT qsc_question_set_code_fk FOREIGN KEY (question_set_code)
        REFERENCES public.question_set (code) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.question_set_culture
    OWNER to postgres;

-- Index: fki_qsc_culture_code_fk

-- DROP INDEX IF EXISTS public.fki_qsc_culture_code_fk;

CREATE INDEX IF NOT EXISTS fki_qsc_culture_code_fk
    ON public.question_set_culture USING btree
    (culture_code COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

-- Index: fki_qsc_question_set_code_fk

-- DROP INDEX IF EXISTS public.fki_qsc_question_set_code_fk;

CREATE INDEX IF NOT EXISTS fki_qsc_question_set_code_fk
    ON public.question_set_culture USING btree
    (question_set_code COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;


-- Table: public.meta_question

-- DROP TABLE IF EXISTS public.meta_question;

CREATE TABLE IF NOT EXISTS public.meta_question
(
    id integer NOT NULL DEFAULT nextval('meta_question_id_seq'::regclass),
    question_set_code character(4) COLLATE pg_catalog."default" NOT NULL,
    code character(4) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    CONSTRAINT meta_question_pkey PRIMARY KEY (id),
    CONSTRAINT mq_question_set_code_fk FOREIGN KEY (question_set_code)
        REFERENCES public.question_set (code) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.meta_question
    OWNER to postgres;

-- Index: fki_mq_question_set_code_fk

-- DROP INDEX IF EXISTS public.fki_mq_question_set_code_fk;

CREATE INDEX IF NOT EXISTS fki_mq_question_set_code_fk
    ON public.meta_question USING btree
    (question_set_code COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;


-- Table: public.enrollment

-- DROP TABLE IF EXISTS public.enrollment;

CREATE TABLE IF NOT EXISTS public.enrollment
(
    id integer NOT NULL DEFAULT nextval('enrollment_id_seq'::regclass),
    classroom_id integer,
    student_id integer,
    status integer,
    CONSTRAINT enrollment_pkey PRIMARY KEY (id),
    CONSTRAINT enrollment_classroom_id_fk FOREIGN KEY (classroom_id)
        REFERENCES public.classroom (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT enrollment_student_id_fk FOREIGN KEY (student_id)
        REFERENCES public.student (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.enrollment
    OWNER to postgres;

-- Index: fki_enrollment_classroom_id_fk

-- DROP INDEX IF EXISTS public.fki_enrollment_classroom_id_fk;

CREATE INDEX IF NOT EXISTS fki_enrollment_classroom_id_fk
    ON public.enrollment USING btree
    (classroom_id ASC NULLS LAST)
    TABLESPACE pg_default;

-- Index: fki_enrollment_student_id_fk

-- DROP INDEX IF EXISTS public.fki_enrollment_student_id_fk;

CREATE INDEX IF NOT EXISTS fki_enrollment_student_id_fk
    ON public.enrollment USING btree
    (student_id ASC NULLS LAST)
    TABLESPACE pg_default;


-- Table: public.question

-- DROP TABLE IF EXISTS public.question;

CREATE TABLE IF NOT EXISTS public.question
(
    id integer NOT NULL DEFAULT nextval('question_id_seq'::regclass),
    qsc_id integer NOT NULL,
    mq_id integer NOT NULL,
    alt_code integer,
    difficulty integer DEFAULT 0,
    json json,
    blob bytea,
    version integer,
    iscurrent boolean NOT NULL DEFAULT true,
    CONSTRAINT question_pkey PRIMARY KEY (id),
    CONSTRAINT question_mq_id_fk FOREIGN KEY (mq_id)
        REFERENCES public.meta_question (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT question_qsc_id_fk FOREIGN KEY (qsc_id)
        REFERENCES public.question_set_culture (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.question
    OWNER to postgres;

-- Index: fki_question_mq_id_fk

-- DROP INDEX IF EXISTS public.fki_question_mq_id_fk;

CREATE INDEX IF NOT EXISTS fki_question_mq_id_fk
    ON public.question USING btree
    (mq_id ASC NULLS LAST)
    TABLESPACE pg_default;

-- Index: fki_question_qsc_id_fk

-- DROP INDEX IF EXISTS public.fki_question_qsc_id_fk;

CREATE INDEX IF NOT EXISTS fki_question_qsc_id_fk
    ON public.question USING btree
    (qsc_id ASC NULLS LAST)
    TABLESPACE pg_default;


-- Table: public.session

CREATE TABLE IF NOT EXISTS public.session
(
    id integer NOT NULL DEFAULT nextval('session_id_seq'::regclass),
    enrollment_id integer NOT NULL,
    attempt integer NOT NULL DEFAULT 0,
    total_questions integer,
    difficulty integer,
    cultures character varying COLLATE pg_catalog."default",
    status integer DEFAULT 0,
    expected_start date,
    start_time timestamp with time zone,
    complete timestamp with time zone,
    correct integer,
    wrong integer,
    CONSTRAINT session_pkey PRIMARY KEY (id),
    CONSTRAINT session_enrollment_id_fk FOREIGN KEY (enrollment_id)
        REFERENCES public.enrollment (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.session
    OWNER to postgres;

-- Index: fki_session_enrollment_id_fk

-- DROP INDEX IF EXISTS public.fki_session_enrollment_id_fk;

CREATE INDEX IF NOT EXISTS fki_session_enrollment_id_fk
    ON public.session USING btree
    (enrollment_id ASC NULLS LAST)
    TABLESPACE pg_default;


-- Table: public.session_question

-- DROP TABLE IF EXISTS public.session_question;

CREATE TABLE IF NOT EXISTS public.session_question
(
    id bigint NOT NULL DEFAULT nextval('session_question_id_seq'::regclass),
    session_id integer NOT NULL,
    question_id integer NOT NULL,
    question_order integer,
    status integer,
    answer_order integer,
    correct_answer integer,
    student_answer integer,
    start_time timestamp with time zone,
    end_time timestamp with time zone,
    CONSTRAINT session_question_pkey PRIMARY KEY (id),
    CONSTRAINT sq_question_id_fk FOREIGN KEY (question_id)
        REFERENCES public.question (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT sq_session_id_fk FOREIGN KEY (session_id)
        REFERENCES public.session (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.session_question
    OWNER to postgres;

-- Index: fki_sq_question_id_fk

-- DROP INDEX IF EXISTS public.fki_sq_question_id_fk;

CREATE INDEX IF NOT EXISTS fki_sq_question_id_fk
    ON public.session_question USING btree
    (question_id ASC NULLS LAST)
    TABLESPACE pg_default;

-- Index: fki_sq_session_id_fk

-- DROP INDEX IF EXISTS public.fki_sq_session_id_fk;

CREATE INDEX IF NOT EXISTS fki_sq_session_id_fk
    ON public.session_question USING btree
    (session_id ASC NULLS LAST)
    TABLESPACE pg_default;


-- Table: public.resource_culture_links

-- DROP TABLE IF EXISTS public.resource_culture_links;

CREATE TABLE IF NOT EXISTS public.resource_culture_links
(
    id integer NOT NULL DEFAULT nextval('resource_culture_links_id_seq'::regclass),
    culture_code character(4) COLLATE pg_catalog."default" NOT NULL,
    resource_code character(10) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT resource_culture_links_pkey PRIMARY KEY (id),
    CONSTRAINT rcl_culture_code_fk FOREIGN KEY (culture_code)
        REFERENCES public.culture (code) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT rcl_resource_code_fk FOREIGN KEY (resource_code)
        REFERENCES public.resources (code) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.resource_culture_links
    OWNER to postgres;

-- Index: fki_rcl_culture_code_fk

-- DROP INDEX IF EXISTS public.fki_rcl_culture_code_fk;

CREATE INDEX IF NOT EXISTS fki_rcl_culture_code_fk
    ON public.resource_culture_links USING btree
    (culture_code COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

-- Index: fki_rcl_resource_code_fk

-- DROP INDEX IF EXISTS public.fki_rcl_resource_code_fk;

CREATE INDEX IF NOT EXISTS fki_rcl_resource_code_fk
    ON public.resource_culture_links USING btree
    (resource_code COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;


-- Table: public.resource_qsc_links

-- DROP TABLE IF EXISTS public.resource_qsc_links;

CREATE TABLE IF NOT EXISTS public.resource_qsc_links
(
    id integer NOT NULL DEFAULT nextval('resource_qsc_links_id_seq'::regclass),
    qsc_id integer NOT NULL,
    resource_code character(10) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT resource_qsc_links_pkey PRIMARY KEY (id),
    CONSTRAINT rqscl_qsc_id_fk FOREIGN KEY (qsc_id)
        REFERENCES public.question_set_culture (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT rqscl_resource_code_fk FOREIGN KEY (resource_code)
        REFERENCES public.resources (code) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.resource_qsc_links
    OWNER to postgres;

-- Index: fki_f

-- DROP INDEX IF EXISTS public.fki_f;

CREATE INDEX IF NOT EXISTS fki_f
    ON public.resource_qsc_links USING btree
    (resource_code COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

-- Index: fki_rqsc_qsc_id_fk

-- DROP INDEX IF EXISTS public.fki_rqsc_qsc_id_fk;

CREATE INDEX IF NOT EXISTS fki_rqsc_qsc_id_fk
    ON public.resource_qsc_links USING btree
    (qsc_id ASC NULLS LAST)
    TABLESPACE pg_default;


-- Table: public.resource_question_links

-- DROP TABLE IF EXISTS public.resource_question_links;

CREATE TABLE IF NOT EXISTS public.resource_question_links
(
    id integer NOT NULL DEFAULT nextval('resource_question_links_id_seq'::regclass),
    question_id integer NOT NULL,
    resource_code character(10) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT resource_question_links_pkey PRIMARY KEY (id),
    CONSTRAINT rql_question_id_fk FOREIGN KEY (question_id)
        REFERENCES public.question (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT rql_resource_code_fk FOREIGN KEY (resource_code)
        REFERENCES public.resources (code) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.resource_question_links
    OWNER to postgres;

-- Index: fki_rql_question_id_fk

-- DROP INDEX IF EXISTS public.fki_rql_question_id_fk;

CREATE INDEX IF NOT EXISTS fki_rql_question_id_fk
    ON public.resource_question_links USING btree
    (question_id ASC NULLS LAST)
    TABLESPACE pg_default;

-- Index: fki_rql_resource_code_fk

-- DROP INDEX IF EXISTS public.fki_rql_resource_code_fk;

CREATE INDEX IF NOT EXISTS fki_rql_resource_code_fk
    ON public.resource_question_links USING btree
    (resource_code COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;


