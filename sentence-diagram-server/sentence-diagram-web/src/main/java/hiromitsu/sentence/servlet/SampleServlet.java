package hiromitsu.sentence.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.PushBuilder;

/**
 * Sample Servlet
 */
public class SampleServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public SampleServlet() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		PushBuilder pb = request.newPushBuilder();
		pb.path("css/bootstrap.min.css");
		pb.path("js/bootstrap.min.js");
		pb.push();
		
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

}
