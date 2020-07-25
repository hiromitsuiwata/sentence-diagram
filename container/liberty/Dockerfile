FROM openliberty/open-liberty:20.0.0.6-full-java8-openj9-ubi-amd64

COPY --chown=1001:0  sentence-diagram-web.war /config/dropins/
COPY --chown=1001:0  postgresql-42.2.14.jar /config/dropins/
COPY --chown=1001:0  server.xml /config/
COPY --chown=1001:0  jvm.options /config/
