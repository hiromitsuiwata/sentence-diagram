--
-- PostgreSQL database dump
--

-- Dumped from database version 13.0
-- Dumped by pg_dump version 13.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: sentence; Type: TABLE; Schema: public; Owner: hiro
--

CREATE TABLE public.sentence (
    id integer NOT NULL,
    text character varying(1024) NOT NULL,
    title character varying(1024),
    url character varying(1024)
);


ALTER TABLE public.sentence OWNER TO hiro;

--
-- Name: sentence_id_seq; Type: SEQUENCE; Schema: public; Owner: hiro
--

CREATE SEQUENCE public.sentence_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sentence_id_seq OWNER TO hiro;

--
-- Name: sentence_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hiro
--

ALTER SEQUENCE public.sentence_id_seq OWNED BY public.sentence.id;


--
-- Name: sentence id; Type: DEFAULT; Schema: public; Owner: hiro
--

ALTER TABLE ONLY public.sentence ALTER COLUMN id SET DEFAULT nextval('public.sentence_id_seq'::regclass);


--
-- Name: sentence sentence_pkey; Type: CONSTRAINT; Schema: public; Owner: hiro
--

ALTER TABLE ONLY public.sentence
    ADD CONSTRAINT sentence_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

