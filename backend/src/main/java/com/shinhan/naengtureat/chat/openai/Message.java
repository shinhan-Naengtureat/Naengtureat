package com.shinhan.naengtureat.chat.openai;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)//null제외
public class Message {

    private String role;
    @JsonProperty("content")
    private Object content;//prompt json으로 받기 위해 object로 변경
    private double temperature;
}
