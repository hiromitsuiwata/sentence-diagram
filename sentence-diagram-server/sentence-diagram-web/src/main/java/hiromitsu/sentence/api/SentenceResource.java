package hiromitsu.sentence.api;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import hiromitsu.sentence.ParsedResult;

/**
 * 文を扱うリソースクラス
 */
@Path("sentence")
public class SentenceResource {

	@GET
	@Produces("application/json")
	public Response getSentence() {

		ParsedResult result = new ParsedResult();
		result.setOriginalSentence("test data");

		return Response.ok(result).build();
	}
}
