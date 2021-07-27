package hiromitsu.sentence.api;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.eclipse.microprofile.metrics.annotation.SimplyTimed;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.enums.SchemaType;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;

import hiromitsu.sentence.infra.JWTTokenNeeded;
import hiromitsu.sentence.service.Sentence;
import hiromitsu.sentence.service.SentenceService;

/**
 * 文を扱うリソースクラス
 */
@ApplicationScoped
@Path("sentences")
@JWTTokenNeeded
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class SentenceResource {

  private static Logger logger = LoggerFactory.getLogger(SentenceResource.class);

  @Inject
  private SentenceService sentenceService;

  @GET
  @SimplyTimed(name = "sentenceGetTime")
  @APIResponse(responseCode = "200", description = "sentence配列", content = @Content(mediaType = "application/json", schema = @Schema(type = SchemaType.ARRAY, implementation = Sentence.class)))
  @APIResponse(responseCode = "401", description = "認証エラー")
  @Operation(summary = "全sentenceを取得する", description = "DBに登録済みの全sentenceを取得する。ログイン必要。")
  public Response getSentences() {
    List<Sentence> list = sentenceService.findAll();

    Gson gson = new Gson();
    String json = gson.toJson(list);
    logger.info(json);

    return Response.ok(json).build();
  }

  @DELETE
  @Path("{id}")
  public Response delete(@PathParam("id") Long id) {
    logger.info("delete: {}", id);
    sentenceService.delete(id);
    return Response.ok().build();
  }

  @GET
  @Path("/search")
  public Response searchSentences(@QueryParam("q") String query) {
    logger.info("query: {}", query);

    List<Sentence> list = sentenceService.search(query);
    Gson gson = new Gson();
    String json = gson.toJson(list);
    logger.info(json);

    return Response.ok(json).build();
  }

  @POST
  public Response createSentence(String request) {
    logger.info(request);

    Gson gson = new Gson();
    Sentence sentence = gson.fromJson(request, Sentence.class);
    Sentence result = sentenceService.create(sentence);

    String json = gson.toJson(result);
    logger.info(json);

    Response response = Response.ok(json).build();
    logger.info("response: {}", response);
    return response;
  }

  @PUT
  @Path("{id}/diagram")
  @SimplyTimed(name = "sentenceCreateDiagramTime")
  public Response createDiagram(@PathParam("id") long id) {
    logger.info("id: {}", id);
    String json = sentenceService.createDiagram(id);
    logger.info(json);
    return Response.ok(json).build();
  }
}
