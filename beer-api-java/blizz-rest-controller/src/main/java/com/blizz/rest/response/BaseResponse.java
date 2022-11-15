package com.blizz.rest.response;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.io.Serializable;

public class BaseResponse extends ResponseEntity<JsonNode> implements Serializable {

    private static ObjectMapper OBJECT_MAPPER;

    private BaseResponse(JsonNode body, HttpStatus httpStatus) {
        super(body, httpStatus);
    }

    public static BaseResponse buildResponse(Object responseObject, HttpStatus httpStatus) {
        return new BaseResponse(getMapper().valueToTree(responseObject), httpStatus);
    }

    private static ObjectMapper getMapper() {
        if (OBJECT_MAPPER == null) {
            OBJECT_MAPPER = new ObjectMapper();
        }

        return OBJECT_MAPPER;
    }
}
