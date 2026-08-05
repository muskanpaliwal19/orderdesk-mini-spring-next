package com.example.orders.service;

import com.example.orders.dto.OrderDto;
import com.example.orders.dto.OrderMapper;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.io.StringWriter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CsvExportService {

    private final OrderService orderService;
    private final OrderMapper orderMapper;

    public CsvExportService(OrderService orderService, OrderMapper orderMapper) {
        this.orderService = orderService;
        this.orderMapper = orderMapper;
    }

    public String exportOrdersToCsv() {
        List<OrderDto> orders = orderService.getAllOrders(Sort.by(Sort.Direction.ASC, "id")).stream()
                .map(orderMapper::toDto)
                .collect(Collectors.toList());
        StringWriter sw = new StringWriter();
        sw.append("id,customer_name,customer_email,item_description,quantity,unit_price_cents,status,created_at,updated_at,notes\n");
        for (OrderDto order : orders) {
            sw.append(String.join(",",
                    String.valueOf(order.id()),
                    escapeCsv(order.customerName()),
                    escapeCsv(order.customerEmail()),
                    escapeCsv(order.itemDescription()),
                    String.valueOf(order.quantity()),
                    String.valueOf(order.unitPriceCents()),
                    order.status().name(),
                    escapeCsv(order.createdAt().toString()),
                    escapeCsv(order.updatedAt().toString()),
                    escapeCsv(order.notes())
            )).append("\n");
        }
        return sw.toString();
    }

    private String escapeCsv(String data) {
        if (data == null) {
            return "";
        }
        if (data.contains(",") || data.contains(""") || data.contains("\n")) {
            return """ + data.replace(""", """") + """;
        }
        return data;
    }
}
