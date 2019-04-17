package hiromitsu.sentence.api;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;

import hiromitsu.sentence.service.Sentence;
import hiromitsu.sentence.service.SentenceService;

/**
 * 文を扱うリソースクラス
 */
@ApplicationScoped
@Path("sentences")
public class SentenceResource {

  private static Logger logger = LoggerFactory.getLogger(SentenceResource.class);
  
  @Inject
  private SentenceService sentenceService;
  
  @GET
  @Produces("application/json")
  public Response getSentences() {
    
    List<Sentence> list = sentenceService.findAll();
    
    Gson gson = new Gson();
    String json = gson.toJson(list);
    logger.info(json);

    Response response = Response.ok(json).build();

    return response;
  }

  @POST
  @Consumes("application/json")
  public Response createSentence(String request) {
    logger.info(request);
    
    Gson gson = new Gson();
    Sentence sentence = gson.fromJson(request, Sentence.class);
    sentenceService.create(sentence);
    
    Response response = Response.ok().build();
    logger.info(response.toString());
    return response;
  }
  
  @PUT
  @Path("{id}/diagram")
  @Produces("application/json")
  public Response createDiagram(@PathParam("id") long id) {
    logger.info(Long.toString(id));
    sentenceService.createDiagram(id);
    Response response = Response.ok().build();
    return response;
  }
}
