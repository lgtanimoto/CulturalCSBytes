CREATE SEQUENCE IF NOT EXISTS public.student_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.student_id_seq
    OWNER TO postgres;

CREATE SEQUENCE IF NOT EXISTS public.teacher_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.teacher_id_seq
    OWNER TO postgres;

CREATE SEQUENCE IF NOT EXISTS public.classroom_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.classroom_id_seq
    OWNER TO postgres;

CREATE SEQUENCE IF NOT EXISTS public.question_set_culture_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.question_set_culture_id_seq
    OWNER TO postgres;

CREATE SEQUENCE IF NOT EXISTS public.meta_question_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.meta_question_id_seq
    OWNER TO postgres;

CREATE SEQUENCE IF NOT EXISTS public.enrollment_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.enrollment_id_seq
    OWNER TO postgres;

CREATE SEQUENCE IF NOT EXISTS public.question_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.question_id_seq
    OWNER TO postgres;

CREATE SEQUENCE IF NOT EXISTS public.session_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.session_id_seq
    OWNER TO postgres;

CREATE SEQUENCE IF NOT EXISTS public.session_question_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.session_question_id_seq
    OWNER TO postgres;

CREATE SEQUENCE IF NOT EXISTS public.resource_culture_links_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.resource_culture_links_id_seq
    OWNER TO postgres;

CREATE SEQUENCE IF NOT EXISTS public.resource_qsc_links_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.resource_qsc_links_id_seq
    OWNER TO postgres;

CREATE SEQUENCE IF NOT EXISTS public.resource_question_links_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.resource_question_links_id_seq
    OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.student
(
    id bigint NOT NULL DEFAULT nextval('student_id_seq'::regclass),
    username character varying(32) COLLATE pg_catalog."default" NOT NULL,
    email character varying(64) COLLATE pg_catalog."default",
    password character varying(512) COLLATE pg_catalog."default" NOT NULL,
    nickname character varying(32) COLLATE pg_catalog."default",
    age smallint,
    registration_date date NOT NULL DEFAULT CURRENT_DATE,
    zip character varying(5) COLLATE pg_catalog."default",
    CONSTRAINT student_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.student
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public.teacher
(
    id integer NOT NULL DEFAULT nextval('teacher_id_seq'::regclass),
    username character varying(32) COLLATE pg_catalog."default" NOT NULL,
    first_name character varying(32) COLLATE pg_catalog."default" NOT NULL,
    last_name character varying(32) COLLATE pg_catalog."default" NOT NULL,
    email character varying(32) COLLATE pg_catalog."default" NOT NULL,
    password character varying(512) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT teacher_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.teacher
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public.question_set
(
    code character(4) COLLATE pg_catalog."default" NOT NULL,
    name character varying(64) COLLATE pg_catalog."default",
    CONSTRAINT question_set_pkey PRIMARY KEY (code)
) TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.question_set
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public.culture
(
    code character(4) COLLATE pg_catalog."default" NOT NULL,
    name character varying(32) COLLATE pg_catalog."default",
    lang character(5) COLLATE pg_catalog."default",
    icon bytea,
    CONSTRAINT culture_pkey PRIMARY KEY (code)
) TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.culture
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public.resources
(
    title character varying(256) COLLATE pg_catalog."default" NOT NULL,
    url character varying(512) COLLATE pg_catalog."default",
    start_date date,
    end_date date,
    memo text COLLATE pg_catalog."default",
    code character(10) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT resources_pkey PRIMARY KEY (code)
) TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.resources
    OWNER to postgres;

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
) TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.classroom
    OWNER to postgres;

CREATE INDEX IF NOT EXISTS fki_classroom_question_set_code_fk
    ON public.classroom USING btree
    (question_set_code COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS fki_classroom_teacher_fk
    ON public.classroom USING btree
    (teacher_id ASC NULLS LAST)
    TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.question_set_culture
(
    id smallint NOT NULL DEFAULT nextval('question_set_culture_id_seq'::regclass),
    question_set_code character(4) COLLATE pg_catalog."default" NOT NULL,
    description character varying(64) COLLATE pg_catalog."default",
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
) TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.question_set_culture
    OWNER to postgres;

CREATE INDEX IF NOT EXISTS fki_qsc_culture_code_fk
    ON public.question_set_culture USING btree
    (culture_code COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS fki_qsc_question_set_code_fk
    ON public.question_set_culture USING btree
    (question_set_code COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

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
) TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.meta_question
    OWNER to postgres;

CREATE INDEX IF NOT EXISTS fki_mq_question_set_code_fk
    ON public.meta_question USING btree
    (question_set_code COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.enrollment
(
    id integer NOT NULL DEFAULT nextval('enrollment_id_seq'::regclass),
    classroom_id integer,
    student_id integer,
    status integer,
    registration_date date NOT NULL DEFAULT CURRENT_DATE,
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
) TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.enrollment
    OWNER to postgres;

CREATE INDEX IF NOT EXISTS fki_enrollment_classroom_id_fk
    ON public.enrollment USING btree
    (classroom_id ASC NULLS LAST)
    TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS fki_enrollment_student_id_fk
    ON public.enrollment USING btree
    (student_id ASC NULLS LAST)
    TABLESPACE pg_default;

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
) TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.question
    OWNER to postgres;

CREATE INDEX IF NOT EXISTS fki_question_mq_id_fk
    ON public.question USING btree
    (mq_id ASC NULLS LAST)
    TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS fki_question_qsc_id_fk
    ON public.question USING btree
    (qsc_id ASC NULLS LAST)
    TABLESPACE pg_default;

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
    end_time timestamp with time zone,
    correct integer,
    wrong integer,
    CONSTRAINT session_pkey PRIMARY KEY (id),
    CONSTRAINT session_enrollment_id_fk FOREIGN KEY (enrollment_id)
        REFERENCES public.enrollment (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
) TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.session
    OWNER to postgres;

CREATE INDEX IF NOT EXISTS fki_session_enrollment_id_fk
    ON public.session USING btree
    (enrollment_id ASC NULLS LAST)
    TABLESPACE pg_default;

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
) TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.session_question
    OWNER to postgres;

CREATE INDEX IF NOT EXISTS fki_sq_question_id_fk
    ON public.session_question USING btree
    (question_id ASC NULLS LAST)
    TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS fki_sq_session_id_fk
    ON public.session_question USING btree
    (session_id ASC NULLS LAST)
    TABLESPACE pg_default;

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
) TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.resource_culture_links
    OWNER to postgres;

CREATE INDEX IF NOT EXISTS fki_rcl_culture_code_fk
    ON public.resource_culture_links USING btree
    (culture_code COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS fki_rcl_resource_code_fk
    ON public.resource_culture_links USING btree
    (resource_code COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

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
) TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.resource_qsc_links
    OWNER to postgres;

CREATE INDEX IF NOT EXISTS fki_f
    ON public.resource_qsc_links USING btree
    (resource_code COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS fki_rqsc_qsc_id_fk
    ON public.resource_qsc_links USING btree
    (qsc_id ASC NULLS LAST)
    TABLESPACE pg_default;

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
) TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.resource_question_links
    OWNER to postgres;

CREATE INDEX IF NOT EXISTS fki_rql_question_id_fk
    ON public.resource_question_links USING btree
    (question_id ASC NULLS LAST)
    TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS fki_rql_resource_code_fk
    ON public.resource_question_links USING btree
    (resource_code COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

CREATE OR REPLACE FUNCTION select_questions(culture_id TEXT, difficulty_code INTEGER, num_questions INTEGER)
    RETURNS TABLE (question_id INTEGER, question_json JSON)
    LANGUAGE PLPGSQL
    AS $$
    BEGIN
        RETURN QUERY
            SELECT question.id AS question_id, question.json AS question_json 
            FROM question JOIN question_set_culture ON question.qsc_id = question_set_culture.id
            WHERE question_set_culture.culture_code = culture_id
            ORDER BY RANDOM() LIMIT num_questions;
    END
    $$;

CREATE OR REPLACE PROCEDURE insert_session_questions(session_id INTEGER, cultures TEXT[], distr INTEGER[])
    LANGUAGE PLPGSQL
    AS $$
    DECLARE
    answer INTEGER;
    answer_order INTEGER;
    answer_order_array INTEGER[] := ARRAY[1,2,3,4];
    correct_answer INTEGER;
    culture_id TEXT;
    culture_count INTEGER := 0;
    culture_name TEXT;
    question_count INTEGER := 0;
    question_id INTEGER;
    question_json JSON;
    BEGIN
        CREATE TEMP TABLE temp_question(id INTEGER, json JSON);
        FOREACH culture_name IN ARRAY cultures
        LOOP
            SELECT culture.code INTO culture_id FROM culture WHERE culture.name = culture_name;
            INSERT INTO temp_question SELECT * FROM select_questions(culture_id, 0, distr[culture_count + 1]);
            culture_count = culture_count + 1;
        END LOOP;
        FOR question_id, question_json IN 
        SELECT id, json FROM temp_question ORDER BY RANDOM()
        LOOP
            question_count = question_count + 1;
            correct_answer = question_json->'CorrectAnswer';
            answer_order = 0;
            answer_order_array = (SELECT ARRAY_AGG(u ORDER BY RANDOM()) FROM UNNEST(answer_order_array) u);
            FOREACH answer IN ARRAY answer_order_array
            LOOP
                answer_order = 10 * answer_order + answer;
            END LOOP;
            INSERT INTO session_question (session_id, question_id, question_order, status, answer_order, correct_answer) 
            VALUES (session_id, question_id, question_count, 0, answer_order, correct_answer);
        END LOOP;
    END
    $$;
