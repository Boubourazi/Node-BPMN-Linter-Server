import 'package:flutter/material.dart';
import 'package:flutter_dropzone/flutter_dropzone.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'BPMN Checker',
      theme: ThemeData(
        primarySwatch: Colors.indigo,
      ),
      home: const MyHomePage(title: 'BPMN Checker'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({Key? key, required this.title}) : super(key: key);
  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  bool pending = false;
  List<dynamic> text = ["Drag here !"];

  late DropzoneViewController controller;
  static const JsonDecoder parser = JsonDecoder();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(
        child: Stack(
          children: <Widget>[
            DropzoneView(
              onCreated: (DropzoneViewController ctrl) => controller = ctrl,
              onDrop: (x) {
                setState(() {
                  pending = true;
                });
                controller.getFileData(x).then(
                  (value) async {
                    var request = http.MultipartRequest(
                      'POST',
                      Uri.parse(
                          'http://localhost:8080/bpmnfunction/checkdiagram'),
                    );
                    request.files
                        .add(http.MultipartFile.fromBytes("diagram", value));

                    http.StreamedResponse response = await request.send();
                    var responseMessage = await response.stream.bytesToString();
                    var message = parser.convert(responseMessage);

                    setState(() {
                      pending = false;
                    });
                    if (response.statusCode == 200) {
                      setState(() {
                        text = message['message']
                            .map<String>((x) => x['name'].toString())
                            .toList();
                      });
                    } else {
                      print(response.reasonPhrase);
                    }
                  },
                );
              },
            ),
            Center(
              child: pending
                  ? const CircularProgressIndicator()
                  : Column(
                      children: text.map((e) => Text(e)).toList(),
                    ),
            )
          ],
        ),
      ),
    );
  }
}
