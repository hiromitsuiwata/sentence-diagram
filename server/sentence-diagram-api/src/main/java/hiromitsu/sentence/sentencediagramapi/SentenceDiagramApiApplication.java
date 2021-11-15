package hiromitsu.sentence.sentencediagramapi;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

import com.auth0.jwt.JWT;
import com.google.gson.Gson;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import okhttp3.FormBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

@SpringBootApplication
@RestController
public class SentenceDiagramApiApplication {

	private static String clientSecret;

	public static void main(String[] args) {
		for (String arg : args) {
			System.out.println(arg);
			if (arg.startsWith("--client.secret")) {
				clientSecret = arg.split("=")[1];
			}
		}
		SpringApplication.run(SentenceDiagramApiApplication.class, args);
	}

	@GetMapping("/hello")
	public String hello(@RequestParam(value = "name", defaultValue = "World") String name) {
		return String.format("Hello, %s!", name);
	}

	@GetMapping("/callback")
	public String callback(@RequestParam(value = "code") String code, @RequestParam(value = "state") String state,
			HttpServletResponse response) {

		String tokenResponse = null;
		OkHttpClient client = new OkHttpClient();
		RequestBody body = new FormBody.Builder().add("grant_type", "authorization_code").add("code", code)
				.add("client_id", "sample_application")
				.add("redirect_uri", "http://localhost:2000/api/greeting/callback").add("client_secret", clientSecret)
				.build();
		Request request = new Request.Builder()
				.url("http://localhost:8080/auth/realms/sample_service/protocol/openid-connect/token").post(body)
				.build();

		String accessToken = null;
		String accessTokenDecoded = null;
		String idTokenDecoded = null;
		try (Response keycloakResponse = client.newCall(request).execute()) {
			tokenResponse = keycloakResponse.body().string();
			Gson gson = new Gson();
			TokenResponse t = gson.fromJson(tokenResponse, TokenResponse.class);
			accessToken = t.access_token;
			Base64.Decoder decoder = Base64.getDecoder();
			accessTokenDecoded = new String(decoder.decode(JWT.decode(t.access_token).getPayload()),
					StandardCharsets.UTF_8);
			idTokenDecoded = new String(decoder.decode(JWT.decode(t.id_token).getPayload()), StandardCharsets.UTF_8);
			Cookie cookie = new Cookie("ACCESS_TOKEN", accessToken);
			System.out.println(accessToken);
			response.addCookie(cookie);
		} catch (IOException e) {
			e.printStackTrace();
		}

		return String.format(
				"code: %s , state: %s , access_token: %s , access_token_decoded: %s , id_token_decoded: %s", code,
				state, accessToken, accessTokenDecoded, idTokenDecoded);
	}
}
