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
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
import org.eclipse.microprofile.openapi.annotations.parameters.RequestBody;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

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

  private static final Logger LOGGER = LogManager.getLogger();

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
    LOGGER.info(json);

    return Response.ok(json).build();
  }

  @DELETE
  @Path("{id}")
  @APIResponse(responseCode = "200", description = "削除されたID", content = @Content(mediaType = "application/json", schema = @Schema(type = SchemaType.STRING)))
  @Operation(summary = "sentenceを削除する", description = "指定したsentenceを削除する")
  public Response delete(
      @Parameter(description = "sentence ID", required = true, schema = @Schema(type = SchemaType.STRING)) @PathParam("id") Long id) {
    LOGGER.info("delete: {}", id);
    sentenceService.delete(id);
    return Response.ok().build();
  }

  @GET
  @Path("/search")
  @APIResponse(responseCode = "200", description = "検索にヒットしたsentence", content = @Content(mediaType = "application/json", schema = @Schema(type = SchemaType.ARRAY, implementation = Sentence.class)))
  @Operation(summary = "sentenceを検索する", description = "条件を指定してsentenceを検索する")
  public Response searchSentences(@QueryParam("q") String query) {
    LOGGER.info("query: {}", query);

    List<Sentence> list = sentenceService.search(query);
    Gson gson = new Gson();
    String json = gson.toJson(list);
    LOGGER.info(json);

    return Response.ok(json).build();
  }

  @POST
  @APIResponse(responseCode = "200", description = "登録されたsentence", content = @Content(mediaType = "application/json", schema = @Schema(type = SchemaType.OBJECT, implementation = Sentence.class)))
  @Operation(summary = "sentenceを登録する", description = "sentenceを登録する")
  public Response createSentence(
      @RequestBody(description = "登録するsentence", required = true, content = @Content(mediaType = "application/json", schema = @Schema(type = SchemaType.OBJECT, implementation = Sentence.class))) String request) {
    LOGGER.info(request);

    Gson gson = new Gson();
    Sentence sentence = gson.fromJson(request, Sentence.class);
    Sentence result = sentenceService.create(sentence);

    String json = gson.toJson(result);
    LOGGER.info(json);

    Response response = Response.ok(json).build();
    LOGGER.info("response: {}", response);
    return response;
  }

  @PUT
  @Path("{id}/diagram")
  @SimplyTimed(name = "sentenceCreateDiagramTime")
  @APIResponse(responseCode = "200", description = "表示用ノードの配列", content = @Content(mediaType = "application/json"))
  @Operation(summary = "diagramを作成する", description = "指定したsentenceのdiagramを作成する")
  public Response createDiagram(
      @Parameter(description = "sentence ID", required = true, schema = @Schema(type = SchemaType.STRING)) @PathParam("id") long id) {
    LOGGER.info("id: {}", id);
    String json = sentenceService.createDiagram(id);
    LOGGER.info(json);
    return Response.ok(json).build();
  }
}
